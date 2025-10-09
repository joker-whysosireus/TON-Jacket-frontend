import './TaskButton.css';

function TaskButton({ task, onTaskAction, getButtonState, getButtonContent }) {
  const buttonState = getButtonState(task);
  const buttonContent = getButtonContent(task);

  return (
    <button 
      className={`task-action-btn ${buttonState} ${task.type}`}
      onClick={() => onTaskAction(task)}
      disabled={buttonState === 'claimed'}
    >
      {buttonContent}
    </button>
  );
}

export default TaskButton;