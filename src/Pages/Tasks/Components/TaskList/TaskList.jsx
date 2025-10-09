import TaskItem from '../TaskItem/TaskItem';
import './TaskList.css';

function TaskList({ tasks, onTaskAction, getButtonState, getButtonContent }) {
  return (
    <div className="tasks-list-wrapper">
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <TaskItem 
            key={task.id}
            task={task}
            index={index}
            onTaskAction={onTaskAction}
            getButtonState={getButtonState}
            getButtonContent={getButtonContent}
          />
        ))}
      </div>
      <div className="scroll-glow"></div>
    </div>
  );
}

export default TaskList;