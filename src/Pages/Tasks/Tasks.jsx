import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import './Tasks.css';

function Tasks({ userData, updateUserData }) {
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

    const [logs, setLogs] = useState([]);

    // Ссылки для задач
    const TELEGRAM_CHANNEL = "https://t.me/ton_mania_channel";

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addLog = (message) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleTaskCompletion = async (taskId, rewardAmount, taskKey, channel = null) => {
        addLog(`Начало выполнения задачи ${taskId}`);
        
        // НЕМЕДЛЕННО обновляем состояние
        const updatedTasks = { ...tasks, [taskKey]: true };
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        
        addLog(`Состояние задачи ${taskId} обновлено на true`);

        if (channel) {
            addLog(`Открытие канала: ${channel}`);
            window.open(channel, '_blank');
        }
        
        try {
            addLog(`Отправка запроса на сервер...`);
            
            const requestBody = {
                taskId: taskId,
                rewardAmount: rewardAmount,
                telegramUserId: userData.telegram_user_id
            };

            addLog(`Данные запроса: ${JSON.stringify(requestBody)}`);

            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            addLog(`Статус ответа: ${response.status}`);
            addLog(`OK: ${response.ok}`);

            const data = await response.json();
            addLog(`Данные ответа: ${JSON.stringify(data)}`);

            if (response.ok) {
                addLog(`УСПЕХ: Задача ${taskId} выполнена!`);
                updateUserData(data.userData);
            } else {
                addLog(`ОШИБКА: ${data.error}`);
                // Откатываем состояние в случае ошибки
                const revertedTasks = { ...tasks };
                setTasks(revertedTasks);
                localStorage.setItem('tasks', JSON.stringify(revertedTasks));
                addLog(`Состояние задачи ${taskId} откачено`);
            }
        } catch (error) {
            addLog(`ОШИБКА СЕТИ: ${error.message}`);
            // Откатываем состояние в случае ошибки
            const revertedTasks = { ...tasks };
            setTasks(revertedTasks);
            localStorage.setItem('tasks', JSON.stringify(revertedTasks));
            addLog(`Состояние задачи ${taskId} откачено`);
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
        if (tasks[taskKey]) {
            return 'Done!';
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

    const taskList = [
        {
            id: 0,
            type: 'ad',
            title: 'Watch a short video',
            reward: '+500 coins',
            rewardAmount: 500,
            requiredAmount: 1,
            currentProgress: 0,
            buttonText: 'Watch',
            taskKey: 'task0'
        },
        {
            id: 1,
            type: 'subscribe',
            title: 'Subscribe to our channel',
            reward: '+100 coins',
            rewardAmount: 100,
            requiredAmount: 1,
            currentProgress: 0,
            buttonText: 'Subscribe',
            taskKey: 'task1'
        },
        {
            id: 2,
            type: 'friends',
            title: 'Invite 5 friends',
            reward: '+250 coins',
            rewardAmount: 250,
            requiredAmount: 5,
            currentProgress: userData?.invited_friends || 0,
            buttonText: 'Get',
            taskKey: 'task2'
        },
        {
            id: 3,
            type: 'friends',
            title: 'Invite 10 friends',
            reward: '+500 coins',
            rewardAmount: 500,
            requiredAmount: 10,
            currentProgress: userData?.invited_friends || 0,
            buttonText: 'Get',
            taskKey: 'task3'
        },
        {
            id: 4,
            type: 'friends',
            title: 'Invite 25 friends',
            reward: '+1500 coins',
            rewardAmount: 1500,
            requiredAmount: 25,
            currentProgress: userData?.invited_friends || 0,
            buttonText: 'Get',
            taskKey: 'task4'
        },
        {
            id: 5,
            type: 'friends',
            title: 'Invite 50 friends',
            reward: '+3000 coins',
            rewardAmount: 3000,
            requiredAmount: 50,
            currentProgress: userData?.invited_friends || 0,
            buttonText: 'Get',
            taskKey: 'task5'
        },
        {
            id: 6,
            type: 'bet',
            title: 'Make a bet of 5 TON',
            reward: '+100 coins',
            rewardAmount: 100,
            requiredAmount: 5,
            currentProgress: userData?.bet_amount || 0,
            buttonText: 'Get',
            taskKey: 'task6'
        },
        {
            id: 7,
            type: 'bet',
            title: 'Make a bet of 25 TON',
            reward: '+500 coins',
            rewardAmount: 500,
            requiredAmount: 25,
            currentProgress: userData?.bet_amount || 0,
            buttonText: 'Get',
            taskKey: 'task7'
        },
        {
            id: 8,
            type: 'bet',
            title: 'Make a bet of 50 TON',
            reward: '+1000 coins',
            rewardAmount: 1000,
            requiredAmount: 50,
            currentProgress: userData?.bet_amount || 0,
            buttonText: 'Get',
            taskKey: 'task8'
        }
    ];

    return (
        <div className="tasks-container">
            <BalanceSection userData={userData}/>
            
            
            {/* Заголовок */}
            <div className="tasks-header">
                <div className="header-icon">📋</div>
                <div className="header-text">
                    <p className="header-line">get rewards for completing partners,</p>
                    <p className="header-line">daily and main tasks</p>
                </div>
            </div>

            {/* Список задач */}
            <div className="tasks-list-wrapper">
                <div className="tasks-list">
                    {taskList.map((task, index) => {
                        const taskIcon = task.type === 'ad' ? '📺' : task.type === 'subscribe' ? '📢' : '📝';
                        const isCompleted = tasks[task.taskKey];
                        const isAvailable = isTaskAvailable(task);
                        const buttonText = getButtonText(task, task.taskKey);
                        const isDisabled = isCompleted || !isAvailable;

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
            </div>

            {/* Логи для отладки */}
            <div className="debug-logs">
                <h3>Логи отладки:</h3>
                <div className="logs-container">
                    {logs.map((log, index) => (
                        <div key={index} className="log-entry">{log}</div>
                    ))}
                </div>
                <button onClick={() => setLogs([])} className="clear-logs-btn">
                    Очистить логи
                </button>
            </div>

            <Menu />
        </div>
    );
}

export default Tasks;