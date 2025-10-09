import TaskButton from '../TaskButton/TaskButton';
import './TaskItem.css';

function TaskItem({ task, index, onTaskAction, getButtonState, getButtonContent }) {
  const getTaskIcon = (type) => {
    switch (type) {
      case 'ad': return '📺';
      case 'subscribe': return '📢';
      default: return '📝';
    }
  };

  return (
    <div className={`task-item ${index > 0 ? 'task-with-top-line' : ''}`}>
      <div className="task-icon">
        {getTaskIcon(task.type)}
      </div>
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <span className="task-reward">{task.reward}</span>
      </div>
      <TaskButton 
        task={task}
        onTaskAction={onTaskAction}
        getButtonState={getButtonState}
        getButtonContent={getButtonContent}
      />
    </div>
  );
}

export default TaskItem;