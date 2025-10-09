import './TaskHeader.css';

function TaskHeader() {
  return (
    <div className="tasks-header">
      <div className="header-icon">📋</div>
      <div className="header-text">
        <p className="header-line">get rewards for completing partners,</p>
        <p className="header-line">daily and main tasks</p>
      </div>
    </div>
  );
}

export default TaskHeader;