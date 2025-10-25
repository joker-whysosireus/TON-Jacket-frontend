import { useState, useEffect, useCallback } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import { translations, formatString } from '../../Assets/Lang/translation';
import './Tasks.css';

// Константы для рекламных сетей
const MONETAG_ZONE_ID = "10036621"; // Ваш zone_id из первого проекта

function Tasks({ userData, updateUserData, language = 'english' }) {
    // Получаем переводы для текущего языка
    const t = translations[language]?.tasks || translations.english.tasks;
    const balanceT = translations[language]?.balance || translations.english.balance;
    const commonT = translations[language]?.common || translations.english.common;

    // СБРОС ЛОКАЛЬНОГО ХРАНИЛИЩА - изменяем ключ для принудительного сброса
    const storageKey = 'tasks_v2'; // Измененный ключ для сброса хранилища
    
    const [tasks, setTasks] = useState(() => {
        const storedTasksString = localStorage.getItem(storageKey);
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

    // Состояния для Monetag рекламы
    const [monetagAdAvailable, setMonetagAdAvailable] = useState(false);
    const [isMonetagLoading, setIsMonetagLoading] = useState(false);
    
    // СБРОС COOLDOWN - изменяем ключ для принудительного сброса
    const cooldownKey = 'monetagCooldown_v2';
    
    const [monetagCooldown, setMonetagCooldown] = useState(() => {
        const stored = localStorage.getItem(cooldownKey);
        return stored ? parseInt(stored) : 0;
    });
    const [remainingTime, setRemainingTime] = useState(0);

    // Ссылки для задач
    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    // Сохранение cooldown в localStorage
    useEffect(() => {
        localStorage.setItem(cooldownKey, monetagCooldown.toString());
    }, [monetagCooldown]);

    // Проверка доступности функции Monetag
    useEffect(() => {
        const checkMonetagFunction = () => {
            if (window[`show_${MONETAG_ZONE_ID}`] && typeof window[`show_${MONETAG_ZONE_ID}`] === 'function') {
                setMonetagAdAvailable(true);
            } else {
                setMonetagAdAvailable(false);
            }
        };
        
        checkMonetagFunction();
        const intervalId = setInterval(checkMonetagFunction, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Вычисление оставшегося времени для Monetag
    useEffect(() => {
        const calculateRemainingTime = () => {
            const now = Date.now();
            const timeLeft = monetagCooldown > now ? Math.floor((monetagCooldown - now) / 1000) : 0;
            setRemainingTime(timeLeft);
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);
        return () => clearInterval(interval);
    }, [monetagCooldown]);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }, [tasks]);

    // Функция для показа рекламы Monetag
    const handleMonetagAd = useCallback(async () => {
        if (!monetagAdAvailable || isMonetagLoading || remainingTime > 0) return;
        
        setIsMonetagLoading(true);
        
        const showAdFunction = window[`show_${MONETAG_ZONE_ID}`];
        
        if (typeof showAdFunction !== 'function') {
            console.error('Monetag show function not available');
            setIsMonetagLoading(false);
            return;
        }
        
        try {
            await showAdFunction({ 
                ymid: userData.telegram_user_id || 'anonymous'
            });
            
            // После успешного показа рекламы вызываем функцию для начисления 75 coins
            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/ads-reward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegram_user_id: userData.telegram_user_id
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Обновляем userData
                updateUserData(result.userData);
                
                // Устанавливаем кулдаун 3 секунды
                const cooldownEnd = Date.now() + 3000;
                setMonetagCooldown(cooldownEnd);
                
                alert('+75 coins received for watching the ad!');
            } else {
                alert('Error claiming reward: ' + (result.error || 'Unknown error'));
            }
            
        } catch (error) {
            console.error('Monetag ad error:', error);
            alert('Error showing ad');
        } finally {
            setIsMonetagLoading(false);
        }
    }, [monetagAdAvailable, isMonetagLoading, remainingTime, userData, updateUserData]);

    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        // НЕМЕДЛЕННО обновляем состояние
        const updatedTasks = { ...tasks, [taskKey]: true };
        setTasks(updatedTasks);
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));

        if (channel) {
            window.open(channel, '_blank');
        }
        
        try {
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
            } else {
                // Откатываем состояние в случае ошибки
                const revertedTasks = { ...tasks };
                setTasks(revertedTasks);
                localStorage.setItem(storageKey, JSON.stringify(revertedTasks));
            }
        } catch (error) {
            // Откатываем состояние в случае ошибки
            const revertedTasks = { ...tasks };
            setTasks(revertedTasks);
            localStorage.setItem(storageKey, JSON.stringify(revertedTasks));
        }
    };

    // Проверка доступности кнопок для friends и bet задач
    const isTaskAvailable = (task) => {
        if (task.type === 'friends' || task.type === 'bet') {
            return task.currentProgress >= task.requiredAmount;
        }
        return true; // Для ad и subscribe всегда доступны
    };

    const getButtonText = (task, taskKey) => {
        if (task.type === 'ad') {
            if (!monetagAdAvailable) {
                return t.unavailable || 'Unavailable';
            } else if (remainingTime > 0) {
                return `${remainingTime}s`;
            } else if (isMonetagLoading) {
                return t.loading || 'Loading...';
            } else {
                return t.watch || 'Watch';
            }
        }
        
        if (tasks[taskKey]) {
            return t.done || 'Done!';
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

    // Обработчик клика по кнопке задачи
    const handleTaskClick = (task, taskKey) => {
        if (task.type === 'ad') {
            handleMonetagAd();
        } else {
            handleTaskCompletion(
                task.id, 
                task.rewardAmount, 
                task.taskKey, 
                task.type === 'subscribe' ? TELEGRAM_CHANNEL : null
            );
        }
    };

    // ВРЕМЕННО УДАЛЕНА РЕКЛАМНАЯ ЗАДАЧА - только для сброса хранилища
    const taskList = [
        // РЕКЛАМНАЯ ЗАДАЧА УДАЛЕНА - task0 временно отсутствует
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
                        const isCompleted = task.type !== 'ad' && tasks[task.taskKey];
                        const isAvailable = isTaskAvailable(task);
                        
                        // Для ad задачи определяем доступность по-другому
                        const isAdDisabled = task.type === 'ad' && 
                                           (!monetagAdAvailable || isMonetagLoading || remainingTime > 0);
                        
                        const buttonText = getButtonText(task, task.taskKey);
                        const isDisabled = (task.type === 'ad' ? isAdDisabled : (isCompleted || !isAvailable));

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
                                    className={`task-action-btn ${
                                        task.type === 'ad' ? 
                                            (isAdDisabled ? 'incomplete' : 'active') :
                                        (isCompleted ? 'claimed' : isAvailable ? 'active' : 'incomplete')
                                    }`}
                                    onClick={() => handleTaskClick(task, task.taskKey)}
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