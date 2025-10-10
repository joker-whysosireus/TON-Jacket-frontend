import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import TaskHeader from './Components/TaskHeader/TaskHeader';
import TaskList from './Components/TaskList/TaskList';
import './Tasks.css';

function Tasks({ userData, updateUserData }) {
  const [tasks, setTasks] = useState([]);
  const [taskStates, setTaskStates] = useState(() => {
    const storedTasks = localStorage.getItem('taskStates');
    return storedTasks ? JSON.parse(storedTasks) : {};
  });

  // Сохраняем состояния задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('taskStates', JSON.stringify(taskStates));
  }, [taskStates]);

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

  const handleTaskCompletion = async (task) => {
    // Сразу обновляем локальное состояние
    const updatedTaskStates = { ...taskStates, [task.id]: true };
    setTaskStates(updatedTaskStates);
    localStorage.setItem('taskStates', JSON.stringify(updatedTaskStates));
    
    // Для подписки на канал - открываем ссылку
    if (task.type === 'subscribe') {
      window.open('https://t.me/ton_mania_channel', '_blank');
    } else if (task.type === 'ad') {
      console.log('Showing ad...');
    }
    
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

      const data = await response.json();

      if (response.ok) {
        updateUserData(data.userData);
      } else {
        // В случае ошибки откатываем состояние
        const revertedTaskStates = { ...taskStates };
        setTaskStates(revertedTaskStates);
        localStorage.setItem('taskStates', JSON.stringify(revertedTaskStates));
      }
    } catch (error) {
      console.error('Error claiming task reward:', error);
      // В случае ошибки откатываем состояние
      const revertedTaskStates = { ...taskStates };
      setTaskStates(revertedTaskStates);
      localStorage.setItem('taskStates', JSON.stringify(revertedTaskStates));
    }
  };

  const getButtonState = (task) => {
    if (task.completed) {
      return 'claimed';
    } else if (task.type === 'ad' || task.type === 'subscribe') {
      return 'active';
    } else if (task.currentProgress >= task.requiredAmount) {
      return 'completed';
    } else {
      return 'incomplete';
    }
  };

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

  return (
    <div className="tasks-container">
      <BalanceSection userData={userData}/>
      <Menu />
      <TaskHeader />
      <TaskList 
        tasks={tasks}
        onTaskAction={handleTaskCompletion}
        getButtonState={getButtonState}
        getButtonContent={getButtonContent}
      />
    </div>
  );
}

export default Tasks;