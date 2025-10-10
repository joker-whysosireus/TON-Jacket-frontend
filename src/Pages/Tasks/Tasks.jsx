import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import './Tasks.css';

function Tasks({ userData, updateUserData }) {
  const [tasks, setTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});

  // Инициализируем все задачи с состоянием false
  useEffect(() => {
    const initialTaskStates = {};
    for (let i = 0; i <= 8; i++) {
      initialTaskStates[i] = false;
    }
    setTaskStates(initialTaskStates);
  }, []);

  // Инициализация задач
  useEffect(() => {
    if (Object.keys(taskStates).length === 0) return;

    const taskList = [
      {
        id: 0,
        type: 'ad',
        title: 'Watch a short video',
        reward: '+500 coins',
        rewardAmount: 500,
        requiredAmount: 1,
        currentProgress: 0,
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
        buttonText: 'Get'
      }
    ];

    setTasks(taskList);
  }, [userData, taskStates]);

  // Получение состояния кнопки
  const getButtonState = (task) => {
    // Если задача уже выполнена
    if (taskStates[task.id] === true) {
      return 'claimed';
    }
    
    // Для задач друзей и ставок проверяем прогресс
    if (task.type === 'friends' || task.type === 'bet') {
      if (task.currentProgress >= task.requiredAmount) {
        return 'completed';
      } else {
        return 'incomplete';
      }
    }
    
    // Для рекламы и подписки всегда активны
    if (task.type === 'ad' || task.type === 'subscribe') {
      return 'active';
    }
    
    return 'incomplete';
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

  // Проверка, заблокирована ли кнопка
  const isButtonDisabled = (task) => {
    const state = getButtonState(task);
    return state === 'incomplete' || state === 'claimed';
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = async (task) => {
    // Если кнопка заблокирована - ничего не делаем
    if (isButtonDisabled(task)) {
      return;
    }

    // НЕМЕДЛЕННО обновляем состояние на "выполнено"
    const newTaskStates = { ...taskStates, [task.id]: true };
    setTaskStates(newTaskStates);

    // Для подписки открываем канал
    if (task.type === 'subscribe') {
      window.open('https://t.me/ton_mania_channel', '_blank');
    }

    // Отправляем запрос на сервер для получения награды
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

  // Если задачи еще не загружены, показываем загрузку
  if (tasks.length === 0) {
    return (
      <div className="tasks-container">
        <BalanceSection userData={userData}/>
        <Menu />
        <div className="tasks-header">
          <div className="header-icon">📋</div>
          <div className="header-text">
            <p className="header-line">get rewards for completing partners,</p>
            <p className="header-line">daily and main tasks</p>
          </div>
        </div>
        <div>Loading tasks...</div>
      </div>
    );
  }

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
            const isDisabled = isButtonDisabled(task);
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