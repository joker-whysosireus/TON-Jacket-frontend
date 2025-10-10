import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import './Tasks.css';

function Tasks({ userData, updateUserData }) {
  const [tasks, setTasks] = useState([]);

  // Загружаем состояния задач из localStorage
  const getInitialTaskStates = () => {
    const stored = localStorage.getItem('taskStates');
    return stored ? JSON.parse(stored) : {};
  };

  const [taskStates, setTaskStates] = useState(getInitialTaskStates);

  // Сохраняем состояния задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('taskStates', JSON.stringify(taskStates));
  }, [taskStates]);

  // Инициализация задач
  useEffect(() => {
    const taskList = [
      {
        id: 0,
        type: 'ad',
        title: 'Watch a short video',
        reward: '+500 coins',
        rewardAmount: 500,
        requiredAmount: 1,
        currentProgress: 0,
        completed: taskStates[0] || false,
        buttonText: 'Watch'
      },
      {
        id: 1,
        type: 'subscribe',
        title: 'Subscribe to our channel',
        reward: '+100 coins',
        rewardAmount: 100,
        requiredAmount: 1,
        currentProgress: 0,
        completed: taskStates[1] || false,
        buttonText: 'Subscribe'
      },
      {
        id: 2,
        type: 'friends',
        title: 'Invite 5 friends',
        reward: '+250 coins',
        rewardAmount: 250,
        requiredAmount: 5,
        currentProgress: userData?.invited_friends || 0,
        completed: taskStates[2] || false,
        buttonText: 'Get'
      },
      {
        id: 3,
        type: 'friends',
        title: 'Invite 10 friends',
        reward: '+500 coins',
        rewardAmount: 500,
        requiredAmount: 10,
        currentProgress: userData?.invited_friends || 0,
        completed: taskStates[3] || false,
        buttonText: 'Get'
      },
      {
        id: 4,
        type: 'friends',
        title: 'Invite 25 friends',
        reward: '+1500 coins',
        rewardAmount: 1500,
        requiredAmount: 25,
        currentProgress: userData?.invited_friends || 0,
        completed: taskStates[4] || false,
        buttonText: 'Get'
      },
      {
        id: 5,
        type: 'friends',
        title: 'Invite 50 friends',
        reward: '+3000 coins',
        rewardAmount: 3000,
        requiredAmount: 50,
        currentProgress: userData?.invited_friends || 0,
        completed: taskStates[5] || false,
        buttonText: 'Get'
      },
      {
        id: 6,
        type: 'bet',
        title: 'Make a bet of 5 TON',
        reward: '+100 coins',
        rewardAmount: 100,
        requiredAmount: 5,
        currentProgress: userData?.bet_amount || 0,
        completed: taskStates[6] || false,
        buttonText: 'Get'
      },
      {
        id: 7,
        type: 'bet',
        title: 'Make a bet of 25 TON',
        reward: '+500 coins',
        rewardAmount: 500,
        requiredAmount: 25,
        currentProgress: userData?.bet_amount || 0,
        completed: taskStates[7] || false,
        buttonText: 'Get'
      },
      {
        id: 8,
        type: 'bet',
        title: 'Make a bet of 50 TON',
        reward: '+1000 coins',
        rewardAmount: 1000,
        requiredAmount: 50,
        currentProgress: userData?.bet_amount || 0,
        completed: taskStates[8] || false,
        buttonText: 'Get'
      }
    ];

    setTasks(taskList);
  }, [userData, taskStates]);

  // Получение состояния кнопки
  const getButtonState = (task) => {
    if (taskStates[task.id]) {
      return 'claimed';
    } else if (task.type === 'ad' || task.type === 'subscribe') {
      return 'active';
    } else if (task.currentProgress >= task.requiredAmount) {
      return 'completed';
    } else {
      return 'incomplete';
    }
  };

  // Получение текста кнопки
  const getButtonContent = (task) => {
    const state = getButtonState(task);
    
    switch (state) {
      case 'claimed':
        return 'Done!';
      case 'completed':
        return task.buttonText;
      case 'active':
        return task.buttonText;
      case 'incomplete':
        return `${task.currentProgress}/${task.requiredAmount}`;
      default:
        return task.buttonText;
    }
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = async (task) => {
    const state = getButtonState(task);
    
    // Если кнопка неактивна - ничего не делаем
    if (state === 'incomplete') {
      return;
    }

    // Сразу обновляем состояние на "выполнено"
    const newTaskStates = { ...taskStates, [task.id]: true };
    setTaskStates(newTaskStates);

    // Для подписки открываем канал
    if (task.type === 'subscribe') {
      window.open('https://t.me/ton_mania_channel', '_blank');
    }

    // Отправляем запрос на сервер
    try {
      const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/claim-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          rewardAmount: task.rewardAmount,
          telegramUserId: userData.telegram_user_id
        })
      });

      if (response.ok) {
        const result = await response.json();
        updateUserData(result.userData);
      } else {
        // Если ошибка - откатываем состояние
        console.error('Failed to claim task reward');
        const revertedTaskStates = { ...taskStates };
        setTaskStates(revertedTaskStates);
      }
    } catch (error) {
      // Если ошибка - откатываем состояние
      console.error('Error claiming task reward:', error);
      const revertedTaskStates = { ...taskStates };
      setTaskStates(revertedTaskStates);
    }
  };

  return (
    <div className="tasks-container">
      <BalanceSection userData={userData}/>
      <Menu />
      
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
          {tasks.map((task, index) => {
            const buttonState = getButtonState(task);
            const buttonContent = getButtonContent(task);
            const isDisabled = buttonState === 'incomplete' || buttonState === 'claimed';
            const taskIcon = task.type === 'ad' ? '📺' : task.type === 'subscribe' ? '📢' : '📝';

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
                  className={`task-action-btn ${buttonState}`}
                  onClick={() => handleButtonClick(task)}
                  disabled={isDisabled}
                >
                  {buttonContent}
                </button>
              </div>
            );
          })}
        </div>
        <div className="scroll-glow"></div>
      </div>
    </div>
  );
}

export default Tasks;