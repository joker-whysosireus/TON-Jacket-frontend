import { useState, useEffect, useCallback } from 'react';
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

    // Состояния для рекламы Gigapub
    const [gigapubAdAvailable, setGigapubAdAvailable] = useState(false);
    const [isGigapubLoading, setIsGigapubLoading] = useState(false);
    const [gigapubCooldown, setGigapubCooldown] = useState(() => {
        const stored = localStorage.getItem('gigapubCooldown');
        return stored ? parseInt(stored) : 0;
    });
    const [remainingTime, setRemainingTime] = useState(0);
    const [adWatchCount, setAdWatchCount] = useState(() => {
        const stored = localStorage.getItem('adWatchCount');
        return stored ? parseInt(stored) : 0;
    });

    // Ссылки для задач
    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    // Сохранение состояний в localStorage
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('gigapubCooldown', gigapubCooldown.toString());
        localStorage.setItem('adWatchCount', adWatchCount.toString());
    }, [tasks, gigapubCooldown, adWatchCount]);

    // Проверка доступности функции GigaPub
    useEffect(() => {
        const checkGigapubFunction = () => {
            if (window.showGiga && typeof window.showGiga === 'function') {
                console.log("GigaPub доступен");
                setGigapubAdAvailable(true);
            } else {
                console.log("GigaPub недоступен, проверяем fallback");
                setGigapubAdAvailable(false);
                
                // Создаем fallback функцию если не существует
                if (!window.AdGigaFallback) {
                    window.AdGigaFallback = function() {
                        return new Promise((resolve) => {
                            console.log("Используем резервную рекламу GigaPub");
                            // Имитируем успешный показ рекламы через 1 секунду
                            setTimeout(resolve, 1000);
                        });
                    };
                }

                // Создаем showGiga если не был создан скриптом
                if (!window.showGiga) {
                    window.showGiga = window.AdGigaFallback;
                    setGigapubAdAvailable(true);
                }
            }
        };
        
        checkGigapubFunction();
        // Проверяем каждые 3 секунды
        const intervalId = setInterval(checkGigapubFunction, 3000);
        return () => clearInterval(intervalId);
    }, []);

    // Вычисление оставшегося времени для рекламы
    useEffect(() => {
        const calculateRemainingTime = () => {
            const now = Date.now();
            const timeLeft = gigapubCooldown > now ? 
                Math.floor((gigapubCooldown - now) / 1000) : 0;
            setRemainingTime(timeLeft);
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);
        return () => clearInterval(interval);
    }, [gigapubCooldown]);

    // ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ФУНКЦИЯ ДЛЯ РЕКЛАМЫ
    const handleGigapubAd = useCallback(async () => {
        console.log("Запуск handleGigapubAd...");
        
        // Проверяем условия
        if (!gigapubAdAvailable) {
            console.error("GigaPub недоступен");
            alert("Рекламный сервис временно недоступен. Попробуйте позже.");
            return;
        }

        if (isGigapubLoading) {
            console.log("Реклама уже загружается...");
            return;
        }

        if (remainingTime > 0) {
            console.log(`Кулдаун активен. Осталось: ${remainingTime} секунд`);
            return;
        }

        console.log("Условия выполнены, начинаем показ рекламы...");
        setIsGigapubLoading(true);

        try {
            // Ждем немного чтобы убедиться что все готово
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log("Вызываем window.showGiga()...");
            
            // ВЫЗЫВАЕМ ФУНКЦИЮ ПОКАЗА РЕКЛАМЫ
            await window.showGiga();
            
            console.log("Реклама успешно показана!");

            // НАЧИСЛЯЕМ НАГРАДУ ПОСЛЕ УСПЕШНОГО ПОКАЗА РЕКЛАМЫ
            try {
                console.log("Отправляем запрос на начисление награды...");
                
                const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        taskId: 0, // ID для рекламной задачи
                        rewardAmount: 500, // Награда за просмотр рекламы
                        telegramUserId: userData.telegram_user_id
                    }),
                });

                const data = await response.json();
                console.log("Ответ от сервера:", data);

                if (response.ok) {
                    console.log("Награда успешно начислена!");
                    updateUserData(data.userData);
                    
                    // Обновляем счетчик просмотров
                    const newCount = adWatchCount + 1;
                    setAdWatchCount(newCount);
                    
                    // Устанавливаем кулдаун 30 секунд перед следующим просмотром
                    const cooldownEnd = Date.now() + 30000; // 30 секунд
                    setGigapubCooldown(cooldownEnd);
                    
                    console.log(`Просмотр #${newCount}. Следующий через 30 секунд.`);
                    
                } else {
                    console.error('Ошибка начисления награды:', data.error);
                    alert("Ошибка начисления награды. Попробуйте еще раз.");
                }
            } catch (claimError) {
                console.error('Ошибка при запросе награды:', claimError);
                alert("Ошибка соединения. Награда не начислена.");
            }
            
        } catch (error) {
            console.error('Ошибка показа рекламы GigaPub:', error);
            
            // Пробуем fallback если доступен
            if (window.AdGigaFallback && typeof window.AdGigaFallback === 'function') {
                console.log("Пробуем fallback...");
                try {
                    await window.AdGigaFallback();
                    console.log("Fallback реклама показана!");
                    
                    // Начисляем награду через fallback
                    try {
                        const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                taskId: 0,
                                rewardAmount: 500,
                                telegramUserId: userData.telegram_user_id
                            }),
                        });

                        const data = await response.json();

                        if (response.ok) {
                            updateUserData(data.userData);
                            const newCount = adWatchCount + 1;
                            setAdWatchCount(newCount);
                            const cooldownEnd = Date.now() + 30000;
                            setGigapubCooldown(cooldownEnd);
                            console.log(`Fallback награда начислена! Просмотр #${newCount}`);
                        }
                    } catch (fallbackClaimError) {
                        console.error('Ошибка начисления fallback награды:', fallbackClaimError);
                    }
                } catch (fallbackError) {
                    console.error('Fallback реклама тоже не сработала:', fallbackError);
                    alert("Не удалось показать рекламу. Попробуйте позже.");
                }
            } else {
                alert("Рекламный сервис временно недоступен.");
            }
        } finally {
            setIsGigapubLoading(false);
            console.log("Завершение handleGigapubAd");
        }
    }, [gigapubAdAvailable, isGigapubLoading, remainingTime, userData, updateUserData, adWatchCount]);

    // ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ ВСЕХ ЗАДАЧ
    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        console.log(`Обработка задачи: ${taskKey}, ID: ${taskId}`);

        // ДЛЯ РЕКЛАМНОЙ ЗАДАЧИ - ВЫЗЫВАЕМ ОТДЕЛЬНУЮ ФУНКЦИЮ
        if (taskKey === 'task0') {
            console.log("Это рекламная задача, вызываем handleGigapubAd");
            await handleGigapubAd();
            return;
        }

        // ДЛЯ ОСТАЛЬНЫХ ЗАДАЧ - СТАНДАРТНАЯ ЛОГИКА
        console.log("Стандартная задача, обновляем состояние...");

        // НЕМЕДЛЕННО обновляем состояние
        const updatedTasks = { ...tasks, [taskKey]: true };
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        if (channel) {
            console.log("Открываем канал:", channel);
            window.open(channel, '_blank');
        }
        
        try {
            console.log("Отправляем запрос на выполнение задачи...");
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
            console.log("Ответ сервера:", data);

            if (response.ok) {
                console.log("Задача выполнена успешно!");
                updateUserData(data.userData);
            } else {
                console.error("Ошибка сервера:", data.error);
                // Откатываем состояние в случае ошибки
                const revertedTasks = { ...tasks };
                setTasks(revertedTasks);
                localStorage.setItem('tasks', JSON.stringify(revertedTasks));
                alert("Ошибка выполнения задачи: " + data.error);
            }
        } catch (error) {
            console.error("Сетевая ошибка:", error);
            // Откатываем состояние в случае ошибки
            const revertedTasks = { ...tasks };
            setTasks(revertedTasks);
            localStorage.setItem('tasks', JSON.stringify(revertedTasks));
            alert("Сетевая ошибка. Попробуйте еще раз.");
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
        if (tasks[taskKey] && taskKey !== 'task0') {
            return t.done || 'Done!';
        } else if (taskKey === 'task0') {
            if (isGigapubLoading) {
                return t.loading || 'Loading...';
            } else if (remainingTime > 0) {
                return formatTime(remainingTime);
            } else if (!gigapubAdAvailable) {
                return t.unavailable || 'Unavailable';
            } else {
                return task.buttonText + ` (${adWatchCount})`; // "Watch (5)"
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

    // Функция для форматирования времени
    const formatTime = (seconds) => {
        return `${seconds}s`;
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
            currentProgress: adWatchCount,
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
                        const isCompleted = tasks[task.taskKey] && task.taskKey !== 'task0';
                        const isAvailable = isTaskAvailable(task);
                        const buttonText = getButtonText(task, task.taskKey);
                        
                        // Для задачи task0 используем отдельную логику доступности
                        let isDisabled = false;
                        if (task.taskKey === 'task0') {
                            isDisabled = isGigapubLoading || remainingTime > 0 || !gigapubAdAvailable;
                        } else {
                            isDisabled = isCompleted || !isAvailable;
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
                                    className={`task-action-btn ${
                                        task.taskKey === 'task0' 
                                            ? (isGigapubLoading ? 'loading' : (remainingTime > 0 ? 'incomplete' : 'active'))
                                            : (isCompleted ? 'claimed' : isAvailable ? 'active' : 'incomplete')
                                    }`}
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