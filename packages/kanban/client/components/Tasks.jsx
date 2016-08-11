import React, { PropTypes } from 'react';
import Task from '../containers/Task.jsx';
import Editable from './Editable.jsx';

export default class Tasks extends React.Component {
  render() {
    const tasks = this.props.tasks.map(task => (
      <Task
        id={task._id}
        key={task._id}
        onMoveTask={this.props.onMoveTask}
      >
        <Editable
          editing={task.editing}
          id={task._id}
          value={task.title}
          onDelete={this.props.onDeleteTask}
          onEdit={this.props.onEditTask}
          onValueClick={this.props.onValueClick}
        />
      </Task>
    ));

    return (
      <ul className="notes-list">
        {tasks}
      </ul>
    );
  }
}

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onValueClick: PropTypes.func.isRequired,
};
