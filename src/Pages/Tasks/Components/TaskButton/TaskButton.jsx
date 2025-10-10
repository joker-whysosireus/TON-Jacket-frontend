import './TaskButton.css';

function TaskButton({ task, onTaskAction, getButtonState, getButtonContent }) {
  const buttonState = getButtonState(task);
  const buttonContent = getButtonContent(task);
  
  // Определяем, должна ли кнопка быть заблокирована
  const isDisabled = buttonState === 'incomplete' || buttonState === 'claimed';

  // Обработчик нажатия
  const handleClick = () => {
    if (!isDisabled) {
      onTaskAction(task);
    }
  };

  return (
    <button 
      className={`task-action-btn ${buttonState} ${task.type}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  );
}

export default TaskButton;