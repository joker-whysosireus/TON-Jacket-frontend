import './TaskButton.css';

function TaskButton({ task, onTaskAction, getButtonState, getButtonContent }) {
  const buttonState = getButtonState(task);
  const buttonContent = getButtonContent(task);
  
  // Кнопка заблокирована только в состоянии incomplete
  const isDisabled = buttonState === 'incomplete';

  const handleClick = () => {
    if (!isDisabled) {
      onTaskAction(task);
    }
  };

  return (
    <button 
      className={`task-action-btn ${buttonState}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  );
}

export default TaskButton;