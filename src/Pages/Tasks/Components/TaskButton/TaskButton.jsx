import './TaskButton.css';

function TaskButton({ task, onTaskAction, getButtonState, getButtonContent }) {
  const buttonState = getButtonState(task);
  const buttonContent = getButtonContent(task);
  
  // Кнопка disabled для incomplete и claimed состояний
  const isDisabled = buttonState === 'incomplete' || buttonState === 'claimed';

  return (
    <button 
      className={`task-action-btn ${buttonState} ${task.type}`}
      onClick={() => onTaskAction(task)}
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  );
}

export default TaskButton;