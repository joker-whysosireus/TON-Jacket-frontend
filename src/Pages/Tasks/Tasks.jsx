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

    const [isAdLoading, setIsAdLoading] = useState(false);
    const [isAdScriptLoaded, setIsAdScriptLoaded] = useState(false);

    // Ссылки для задач
    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    // Проверяем загрузку скрипта рекламы
    useEffect(() => {
        const checkAdScript = () => {
            if (window.Gigapub) {
                setIsAdScriptLoaded(true);
                return true;
            }
            return false;
        };

        // Первоначальная проверка
        if (!checkAdScript()) {
            // Если скрипт еще не загружен, проверяем периодически
            const interval = setInterval(() => {
                if (checkAdScript()) {
                    clearInterval(interval);
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Функция для показа рекламы Gigapub
    const showGigapubAd = () => {
        return new Promise((resolve, reject) => {
            console.log('Attempting to show Gigapub ad...');
            
            if (window.Gigapub && typeof window.Gigapub.showAd === 'function') {
                console.log('Gigapub found, showing ad');
                
                window.Gigapub.showAd({
                    onClose: function() {
                        console.log('Gigapub ad closed successfully');
                        resolve(true);
                    },
                    onError: function(error) {
                        console.error('Gigapub ad error:', error);
                        reject(new Error(`Ad failed: ${error}`));
                    },
                    onLoad: function() {
                        console.log('Gigapub ad loaded');
                    }
                });
            } else {
                console.warn('Gigapub not available, simulating ad');
                // Имитация рекламы для разработки
                setTimeout(() => {
                    console.log('Simulated ad completed');
                    resolve(true);
                }, 3000);
            }
        });
    };

    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        // Для задачи с рекламой (task0) обрабатываем отдельно
        if (taskKey === 'task0') {
            setIsAdLoading(true);
            
            try {
                console.log('Starting ad process for task0');
                
                // Показываем рекламу перед выполнением задачи
                await showGigapubAd();
                
                console.log('Ad completed, claiming reward');
                
                // После завершения рекламы выполняем запрос к серверу
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
                    console.log('Reward claimed successfully after ad view');
                    // Можно показать уведомление об успехе
                } else {
                    console.error('Failed to claim reward:', data.error);
                    // Можно показать уведомление об ошибке
                }
            } catch (error) {
                console.error('Error during ad viewing or reward claim:', error);
                // Можно показать уведомление об ошибке
            } finally {
                setIsAdLoading(false);
            }
        } else {
            // Оригинальная логика для других задач
            const updatedTasks = { ...tasks, [taskKey]: true };
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));

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
                    localStorage.setItem('tasks', JSON.stringify(revertedTasks));
                }
            } catch (error) {
                // Откатываем состояние в случае ошибки
                const revertedTasks = { ...tasks };
                setTasks(revertedTasks);
                localStorage.setItem('tasks', JSON.stringify(revertedTasks));
            }
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
        // Для задачи с рекламой всегда показываем кнопку "Watch"
        if (taskKey === 'task0') {
            if (isAdLoading) {
                return t.loading || 'Loading...';
            }
            return task.buttonText;
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

    // Обновленный taskList с использованием переводов
    const taskList = [
        {
            id: 0,
            type: 'ad',
            title: t.tasks && t.tasks[0] ? t.tasks[0].title : 'Watch a short video',
            reward: '+500 ' + (balanceT.coins || 'coins'),
            rewardAmount: 500,
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
                        // Для задачи с рекламой всегда считаем невыполненной, чтобы кнопка была доступна
                        const isCompleted = task.taskKey === 'task0' ? false : tasks[task.taskKey];
                        const isAvailable = isTaskAvailable(task);
                        const buttonText = getButtonText(task, task.taskKey);
                        // Для task0 кнопка отключается только во время загрузки рекламы
                        const isDisabled = task.taskKey === 'task0' 
                            ? isAdLoading || !isAdScriptLoaded
                            : isCompleted || !isAvailable;

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
                                        isCompleted ? 'claimed' : 
                                        isAvailable ? 'active' : 'incomplete'
                                    } ${isAdLoading ? 'loading' : ''}`}
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