import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import { translations, formatString } from '../../Assets/Lang/translation';
import './Tasks.css';

function Tasks({ userData, updateUserData, language = 'english' }) {
    // Получаем переводы для текущего языка
    const t = translations[language]?.tasks || translations.english.tasks;
    const balanceT = translations[language]?.balance || translations.english.balance;
    const commonT = translations[language]?.common || translations.english.common;

    const [tasks, setTasks] = useState(() => {
        const storedTasksString = localStorage.getItem('tasks');
        const defaultTasks = {
            task0: false,
            task1: false,
            task2: false,
            task3: false,
            task4: false,
            task5: false,
            task6: false,
            task7: false,
            task8: false
        };
        
        if (storedTasksString) {
            try {
                const parsedTasks = JSON.parse(storedTasksString);
                return { ...defaultTasks, ...parsedTasks };
            } catch (error) {
                console.error('Error parsing tasks from localStorage:', error);
                return defaultTasks;
            }
        }
        return defaultTasks;
    });

    // Состояния для GigaPub рекламы
    const [gigapubAdAvailable, setGigapubAdAvailable] = useState(false);
    const [isGigapubLoading, setIsGigapubLoading] = useState(false);
    const [gigapubCooldown, setGigapubCooldown] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    // Ссылки для задач
    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Проверка доступности GigaPub
    useEffect(() => {
        const checkGigapubFunction = () => {
            if (window.showGiga && typeof window.showGiga === 'function') {
                console.log("GigaPub доступен");
                setGigapubAdAvailable(true);
            } else {
                console.log("GigaPub недоступен");
                setGigapubAdAvailable(false);
            }
        };
        
        checkGigapubFunction();
        const intervalId = setInterval(checkGigapubFunction, 5000);
        return () => clearInterval(intervalId);
    }, []);

    // Таймер для кулдауна GigaPub
    useEffect(() => {
        if (gigapubCooldown <= 0) return;

        const interval = setInterval(() => {
            setGigapubCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gigapubCooldown]);

    // Функция для начисления награды
    const claimAdReward = async () => {
        try {
            console.log("Начисляем награду за рекламу");
            
            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: 0,
                    rewardAmount: 75,
                    telegramUserId: userData.telegram_user_id
                }),
            });

            const data = await response.json();

            if (response.ok) {
                updateUserData(data.userData);
                console.log("Награда успешно начислена");
                return true;
            } else {
                console.error('Error claiming task reward:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error calling claim-task:', error);
            return false;
        }
    };

    // Функция для обработки GigaPub рекламы
    const handleGigapubAd = async () => {
        if (!gigapubAdAvailable || isGigapubLoading || gigapubCooldown > 0) {
            return false;
        }
        
        setIsGigapubLoading(true);
        
        try {
            // 1. СНАЧАЛА начисляем награду
            console.log("Начисляем награду ДО показа рекламы");
            const rewardSuccess = await claimAdReward();
            
            if (!rewardSuccess) {
                throw new Error('Не удалось начислить награду');
            }

            // 2. ПОТОМ показываем рекламу
            console.log("Показываем рекламу...");
            
            if (typeof window.showGiga !== 'function') {
                throw new Error('GigaPub show function not available');
            }
            
            await window.showGiga();
            console.log("Реклама успешно показана");
            
            // 3. Устанавливаем кулдаун
            setGigapubCooldown(5);
            return true;
            
        } catch (error) {
            console.error('GigaPub ad error:', error);
            return false;
        } finally {
            setIsGigapubLoading(false);
        }
    };

    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        // Для задачи с рекламой (task0) обрабатываем отдельно
        if (taskKey === 'task0') {
            const success = await handleGigapubAd();
            
            // Если награда начислена и реклама показана, помечаем задачу как выполненную
            if (success) {
                const updatedTasks = { ...tasks, [taskKey]: true };
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            }
            return;
        }

        // Для остальных задач обычная логика
        if (isClaiming || tasks[taskKey]) return;
        
        setIsClaiming(true);

        try {
            // Для URL задач открываем ссылку
            if (channel) {
                window.open(channel, '_blank', 'noopener,noreferrer');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: taskId,
                    rewardAmount: rewardAmount,
                    telegramUserId: userData.telegram_user_id
                }),
            });

            const data = await response.json();

            if (response.ok) {
                updateUserData(data.userData);
                const updatedTasks = { ...tasks, [taskKey]: true };
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            } else {
                console.error('Error claiming reward:', data.error);
            }
        } catch (error) {
            console.error('Error claiming reward:', error);
        } finally {
            setIsClaiming(false);
        }
    };

    // Проверка доступности кнопок для friends и bet задач
    const isTaskAvailable = (task) => {
        if (task.type === 'friends' || task.type === 'bet') {
            return task.currentProgress >= task.requiredAmount;
        }
        return true;
    };

    const getButtonText = (task, taskKey) => {
        if (tasks[taskKey]) {
            return t.done || 'Done!';
        } else if (taskKey === 'task0') {
            if (isGigapubLoading) {
                return '⏳';
            } else if (gigapubCooldown > 0) {
                return `${gigapubCooldown}s`;
            } else {
                return task.buttonText;
            }
        } else if (task.type === 'friends' || task.type === 'bet') {
            if (task.currentProgress >= task.requiredAmount) {
                return task.buttonText;
            } else {
                return `${task.currentProgress}/${task.requiredAmount}`;
            }
        } else {
            return task.buttonText;
        }
    };

    // Функция для получения иконки задачи
    const getTaskIcon = (task) => {
        switch (task.type) {
            case 'ad':
                return '📺';
            case 'subscribe':
                return '📢';
            case 'friends':
                return '🤝';
            case 'bet':
                return '🎰';
            default:
                return '📝';
        }
    };

    // Обновленный taskList с использованием переводов
    const taskList = [
        {
            id: 0,
            type: 'ad',
            title: t.tasks && t.tasks[0] ? t.tasks[0].title : 'Watch a short video',
            reward: '+75 ' + (balanceT.coins || 'coins'),
            rewardAmount: 75,
            requiredAmount: 1,
            currentProgress: 0,
            buttonText: t.watch || 'Watch',
            taskKey: 'task0'
        },
        {
            id: 1,
            type: 'subscribe',
            title: t.tasks && t.tasks[1] ? t.tasks[1].title : 'Subscribe to our channel',
            reward: '+1000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 1000,
            requiredAmount: 1,
            currentProgress: 0,
            buttonText: t.subscribe || 'Subscribe',
            taskKey: 'task1'
        },
        {
            id: 2,
            type: 'friends',
            title: t.tasks && t.tasks[2] ? t.tasks[2].title : 'Invite 5 friends',
            reward: '+2500 ' + (balanceT.coins || 'coins'),
            rewardAmount: 2500,
            requiredAmount: 5,
            currentProgress: userData?.invited_friends || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task2'
        },
        {
            id: 3,
            type: 'friends',
            title: t.tasks && t.tasks[3] ? t.tasks[3].title : 'Invite 10 friends',
            reward: '+5000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 5000,
            requiredAmount: 10,
            currentProgress: userData?.invited_friends || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task3'
        },
        {
            id: 4,
            type: 'friends',
            title: t.tasks && t.tasks[4] ? t.tasks[4].title : 'Invite 25 friends',
            reward: '+1500 ' + (balanceT.coins || 'coins'),
            rewardAmount: 1500,
            requiredAmount: 25,
            currentProgress: userData?.invited_friends || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task4'
        },
        {
            id: 5,
            type: 'friends',
            title: t.tasks && t.tasks[5] ? t.tasks[5].title : 'Invite 50 friends',
            reward: '+3000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 3000,
            requiredAmount: 50,
            currentProgress: userData?.invited_friends || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task5'
        },
        {
            id: 6,
            type: 'bet',
            title: t.tasks && t.tasks[6] ? t.tasks[6].title : 'Make a bet of 5 TON',
            reward: '+1000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 1000,
            requiredAmount: 5,
            currentProgress: userData?.bet_amount || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task6'
        },
        {
            id: 7,
            type: 'bet',
            title: t.tasks && t.tasks[7] ? t.tasks[7].title : 'Make a bet of 25 TON',
            reward: '+5000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 5000,
            requiredAmount: 25,
            currentProgress: userData?.bet_amount || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task7'
        },
        {
            id: 8,
            type: 'bet',
            title: t.tasks && t.tasks[8] ? t.tasks[8].title : 'Make a bet of 50 TON',
            reward: '+10000 ' + (balanceT.coins || 'coins'),
            rewardAmount: 10000,
            requiredAmount: 50,
            currentProgress: userData?.bet_amount || 0,
            buttonText: t.get || 'Get',
            taskKey: 'task8'
        }
    ];

    return (
        <div className="tasks-container">
            <BalanceSection userData={userData} language={language}/>
            
            {/* Заголовок */}
            <div className="tasks-header">
                <div className="header-icon">📋</div>
                <div className="header-text">
                    <p className="header-line">{t.titleLine1 || 'Get rewards for completing partners,'}</p>
                    <p className="header-line">{t.titleLine2 || 'daily and main tasks'}</p>
                </div>
            </div>

            {/* Список задач */}
            <div className="tasks-list-wrapper">
                <div className="tasks-list">
                    {taskList.map((task, index) => {
                        const taskIcon = getTaskIcon(task);
                        const isCompleted = tasks[task.taskKey];
                        const isAvailable = isTaskAvailable(task);
                        const buttonText = getButtonText(task, task.taskKey);
                        
                        let isDisabled = false;
                        if (task.taskKey === 'task0') {
                            isDisabled = !gigapubAdAvailable || isGigapubLoading || gigapubCooldown > 0;
                        } else {
                            isDisabled = isCompleted || !isAvailable || isClaiming;
                        }

                        return (
                            <div 
                                key={task.id} 
                                className={`task-item ${index > 0 ? 'task-with-top-line' : ''}`}
                            >
                                <div className="task-icon">{taskIcon}</div>
                                <div className="task-content">
                                    <span className="task-title">{task.title}</span>
                                    <span className="task-reward">{task.reward}</span>
                                </div>
                                <button 
                                    className={`task-action-btn ${isCompleted ? 'claimed' : isAvailable ? 'active' : 'incomplete'} ${task.taskKey === 'task0' && isGigapubLoading ? 'loading' : ''}`}
                                    onClick={() => handleTaskCompletion(
                                        task.id, 
                                        task.rewardAmount, 
                                        task.taskKey, 
                                        task.type === 'subscribe' ? TELEGRAM_CHANNEL : null
                                    )} 
                                    disabled={isDisabled}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="scroll-glow"></div>
                <Menu language={language} />
            </div>
        </div>
    );
}

export default Tasks;