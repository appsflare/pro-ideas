import React, { PropTypes } from 'react';
import Tasks from './Tasks.jsx';
import Editable from './Editable.jsx';

export default class Lane extends React.Component {
  constructor() {
    super();
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.handleDeleteLane = this.handleDeleteLane.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  handleCreateTask() {
    this.props.onCreateTask(this.props.lane._id);
  }

  handleDeleteLane() {
    const lane = this.props.lane;
    this.props.onDeleteLane(lane._id);
    lane.notes.forEach((noteId) => this.props.onDeleteTask(null, noteId));
  }

  handleDeleteTask(noteId) {
    this.props.onDeleteTask(this.props.lane._id, noteId);
  }

  render() {
    const lane = this.props.lane;
    const {tasks, canAddTask } = this.props;
    const laneTasks = (tasks || []).filter(task => task); // filter out undefined notes
    const connectDragSource = this.props.connectDragSource;
    const connectDragPreview = this.props.connectDragPreview;
    const connectDropTarget = this.props.connectDropTarget;

    return connectDragPreview(
      connectDropTarget(
        <div className={`lane panel ${ canAddTask? 'panel-default':'panel-success'}`}>
          <div className="panel-heading">
            <span className="lane__name">{lane.name}</span>
            <button
              className="lane__delete hidden"
              onClick={this.handleDeleteLane}
              >-</button>
            {
              connectDragSource(
                <button className="lane__drag hidden" />
              )
            }
            { canAddTask ? <button className="add-note pull-right" onClick={this.handleCreateTask} >
              + task
            </button> : '' }
          </div>

          <Tasks
            tasks={laneTasks}
            onDeleteTask={this.handleDeleteTask}
            onEditTask={this.props.onEditTask}
            onValueClick={this.props.onEditTask}
            onMoveTask={this.props.onMoveTask}
            />

        </div>
      )
    );
  }
}

Lane.propTypes = {
  lane: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onCreateTask: PropTypes.func.isRequired,
  onDeleteLane: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditLane: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
};
