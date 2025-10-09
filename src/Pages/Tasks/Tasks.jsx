import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import TaskHeader from './Components/TaskHeader/TaskHeader';
import TaskList from './Components/TaskList/TaskList';
import './Tasks.css';

function Tasks({ userData, updateUserData }) {
  const [tasks, setTasks] = useState([]);
  const [buttonStates, setButtonStates] = useState({});

  // Load button states from localStorage on component mount
  useEffect(() => {
    const savedButtonStates = localStorage.getItem('taskButtonStates');
    if (savedButtonStates) {
      setButtonStates(JSON.parse(savedButtonStates));
    }
  }, []);

  // Save button states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskButtonStates', JSON.stringify(buttonStates));
  }, [buttonStates]);

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
        completed: userData?.claimed_tasks?.includes(0) || buttonStates[0] === 'claimed' || false,
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
        completed: userData?.claimed_tasks?.includes(1) || buttonStates[1] === 'claimed' || false,
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
        completed: userData?.claimed_tasks?.includes(2) || buttonStates[2] === 'claimed' || false,
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
        completed: userData?.claimed_tasks?.includes(3) || buttonStates[3] === 'claimed' || false,
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
        completed: userData?.claimed_tasks?.includes(4) || buttonStates[4] === 'claimed' || false,
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
        completed: userData?.claimed_tasks?.includes(5) || buttonStates[5] === 'claimed' || false,
        buttonText: 'Get'
      },
      {
        id: 6,
        type: 'bet',
        title: 'Make a bet of 5 TON',
        reward: '+1000 coins',
        rewardAmount: 1000,
        requiredAmount: 5,
        currentProgress: userData?.bet_amount || 0,
        completed: userData?.claimed_tasks?.includes(6) || buttonStates[6] === 'claimed' || false,
        buttonText: 'Get'
      },
      {
        id: 7,
        type: 'bet',
        title: 'Make a bet of 25 TON',
        reward: '+5000 coins',
        rewardAmount: 5000,
        requiredAmount: 25,
        currentProgress: userData?.bet_amount || 0,
        completed: userData?.claimed_tasks?.includes(7) || buttonStates[7] === 'claimed' || false,
        buttonText: 'Get'
      },
      {
        id: 8,
        type: 'bet',
        title: 'Make a bet of 50 TON',
        reward: '+10000 coins',
        rewardAmount: 10000,
        requiredAmount: 50,
        currentProgress: userData?.bet_amount || 0,
        completed: userData?.claimed_tasks?.includes(8) || buttonStates[8] === 'claimed' || false,
        buttonText: 'Get'
      }
    ];

    setTasks(taskList);
  }, [userData, buttonStates]);

  const handleTaskAction = async (task) => {
    const buttonState = getButtonState(task);
    
    if (buttonState === 'completed' || buttonState === 'active') {
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
          
          // Update button state in localStorage immediately
          setButtonStates(prev => ({
            ...prev,
            [task.id]: 'claimed'
          }));
          
          // Update user data from server response
          updateUserData(result.userData);
          
          // For subscription task, open channel after claiming reward
          if (task.type === 'subscribe') {
            window.open('https://t.me/ton_mania_channel', '_blank');
          } else if (task.type === 'ad') {
            console.log('Showing ad...');
          }
        } else {
          console.error('Failed to claim task reward');
        }
      } catch (error) {
        console.error('Error claiming task reward:', error);
      }
    }
  };

  const getButtonState = (task) => {
    // Check localStorage first, then userData
    const localStorageState = buttonStates[task.id];
    if (localStorageState === 'claimed') {
      return 'claimed';
    }
    
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
        return '✓';
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
        onTaskAction={handleTaskAction}
        getButtonState={getButtonState}
        getButtonContent={getButtonContent}
      />
    </div>
  );
}

export default Tasks;