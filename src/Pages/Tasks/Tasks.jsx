import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import { translations, formatString } from '../../Assets/Lang/translation';
import './Tasks.css';

function Tasks({ userData, updateUserData, language = 'english' }) {
    const t = translations[language]?.tasks || translations.english.tasks;
    const balanceT = translations[language]?.balance || translations.english.balance;

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
                return { ...defaultTasks, ...JSON.parse(storedTasksString) };
            } catch (error) {
                return defaultTasks;
            }
        }
        return defaultTasks;
    });

    const [adButtonState, setAdButtonState] = useState({
        isLoading: false,
        cooldown: 0,
        isAvailable: false
    });

    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Проверка доступности GigaPub
    useEffect(() => {
        const checkAdAvailability = () => {
            const isAvailable = !!(window.showGiga && typeof window.showGiga === 'function');
            setAdButtonState(prev => ({ ...prev, isAvailable }));
        };

        checkAdAvailability();
        const interval = setInterval(checkAdAvailability, 3000);
        return () => clearInterval(interval);
    }, []);

    // Таймер кулдауна
    useEffect(() => {
        if (adButtonState.cooldown <= 0) return;

        const timer = setInterval(() => {
            setAdButtonState(prev => ({
                ...prev,
                cooldown: prev.cooldown - 1
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [adButtonState.cooldown]);

    // ЕДИНАЯ функция для начисления награды для ВСЕХ задач
    const addCoins = async (taskId, amount) => {
        console.log('💰 Начинаем начисление монет:', { taskId, amount });
        
        try {
            // ВАЖНО: правильные ключи - taskId и telegramUserId
            const requestData = {
                taskId: taskId,
                rewardAmount: amount,
                telegramUserId: userData.telegram_user_id
            };
            
            console.log('📤 Отправляем запрос с данными:', requestData);

            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            console.log('📥 Получен ответ:', response.status, response.statusText);

            const data = await response.json();
            console.log('📊 Данные ответа:', data);
            
            if (response.ok && data.userData) {
                updateUserData(data.userData);
                console.log('✅ Монеты успешно начислены!');
                return true;
            } else {
                console.error('❌ Ошибка начисления:', data.error);
                return false;
            }
        } catch (error) {
            console.error('❌ Ошибка добавления монет:', error);
            return false;
        }
    };

    // Функция для рекламы - использует ТОЧНО ТАКОЙ ЖЕ вызов addCoins как для обычных задач
    const handleAdTask = async () => {
        console.log('🎬 НАЧАЛО: Обработка рекламной задачи');

        if (!adButtonState.isAvailable || adButtonState.isLoading || adButtonState.cooldown > 0) {
            console.log('❌ Реклама недоступна или в кулдауне');
            return;
        }

        setAdButtonState(prev => ({ ...prev, isLoading: true }));

        try {
            console.log('📺 Показываем рекламу...');
            
            await window.showGiga();
            
            console.log('✅ Реклама успешно показана');

            // ТОЧНО ТАКОЙ ЖЕ ВЫЗОВ КАК ДЛЯ ОБЫЧНЫХ ЗАДАЧ
            console.log('💰 Вызываем addCoins(0, 75) - ТОЧНО ТАК ЖЕ КАК ДЛЯ ОБЫЧНЫХ ЗАДАЧ');
            const success = await addCoins(0, 75);
            
            if (success) {
                console.log('🎉 Награда успешно начислена');
                
                setTasks(prev => ({ ...prev, task0: true }));
                setAdButtonState(prev => ({ ...prev, cooldown: 5 }));
            } else {
                console.error('❌ Не удалось начислить награду');
            }

        } catch (error) {
            console.error('❌ Ошибка показа рекламы:', error);
            
            if (window.AdGigaFallback) {
                try {
                    console.log('🔄 Пробуем резервную рекламу...');
                    
                    await window.AdGigaFallback();
                    console.log('✅ Резервная реклама показана');
                    
                    // ТОЧНО ТАКОЙ ЖЕ ВЫЗОВ КАК ДЛЯ ОБЫЧНЫХ ЗАДАЧ
                    const success = await addCoins(0, 75);
                    if (success) {
                        setTasks(prev => ({ ...prev, task0: true }));
                        setAdButtonState(prev => ({ ...prev, cooldown: 5 }));
                    }
                } catch (fallbackError) {
                    console.error('❌ Ошибка резервной рекламы:', fallbackError);
                }
            }
        } finally {
            setAdButtonState(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Функция для обычных задач - использует addCoins
    const handleRegularTask = async (taskId, rewardAmount, taskKey, channel = null) => {
        console.log(`🎯 Обрабатываем обычную задачу: ${taskKey}`);
        
        if (tasks[taskKey]) {
            console.log('⏭️ Задача уже выполнена');
            return;
        }

        if (channel) {
            console.log('🔗 Открываем ссылку:', channel);
            window.open(channel, '_blank', 'noopener,noreferrer');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // ТОЧНО ТАКОЙ ЖЕ ВЫЗОВ КАК ДЛЯ РЕКЛАМЫ
        console.log(`💰 Вызываем addCoins(${taskId}, ${rewardAmount}) - ТОЧНО ТАК ЖЕ КАК ДЛЯ РЕКЛАМЫ`);
        const success = await addCoins(taskId, rewardAmount);
        
        if (success) {
            setTasks(prev => ({ ...prev, [taskKey]: true }));
            console.log(`✅ Задача ${taskKey} выполнена`);
        } else {
            console.error(`❌ Ошибка задачи ${taskKey}`);
        }
    };

    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        console.log(`🖱️ Нажата кнопка задачи: ${taskKey}`);
        
        if (taskKey === 'task0') {
            await handleAdTask();
        } else {
            await handleRegularTask(taskId, rewardAmount, taskKey, channel);
        }
    };

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
            if (adButtonState.isLoading) {
                return '⏳';
            } else if (adButtonState.cooldown > 0) {
                return `${adButtonState.cooldown}s`;
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

    const getTaskIcon = (task) => {
        switch (task.type) {
            case 'ad': return '📺';
            case 'subscribe': return '📢';
            case 'friends': return '🤝';
            case 'bet': return '🎰';
            default: return '📝';
        }
    };

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
            
            <div className="tasks-header">
                <div className="header-icon">📋</div>
                <div className="header-text">
                    <p className="header-line">{t.titleLine1 || 'Get rewards for completing partners,'}</p>
                    <p className="header-line">{t.titleLine2 || 'daily and main tasks'}</p>
                </div>
            </div>

            <div className="tasks-list-wrapper">
                <div className="tasks-list">
                    {taskList.map((task, index) => {
                        const taskIcon = getTaskIcon(task);
                        const isCompleted = tasks[task.taskKey];
                        const isAvailable = isTaskAvailable(task);
                        const buttonText = getButtonText(task, task.taskKey);
                        
                        const isDisabled = task.taskKey === 'task0' 
                            ? !adButtonState.isAvailable || adButtonState.isLoading || adButtonState.cooldown > 0
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
                                    className={`task-action-btn ${isCompleted ? 'claimed' : isAvailable ? 'active' : 'incomplete'}`}
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