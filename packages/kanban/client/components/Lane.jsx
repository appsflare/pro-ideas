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
    this.props.onCreateTask(this.props.lane.id);
  }

  handleDeleteLane() {
    const lane = this.props.lane;
    this.props.onDeleteLane(lane.id);
    lane.notes.forEach((noteId) => this.props.onDeleteTask(null, noteId));
  }

  handleDeleteTask(noteId) {
    this.props.onDeleteTask(this.props.lane.id, noteId);
  }

  render() {
    const lane = this.props.lane;
    const {tasks } = this.props;
    const laneTasks = (tasks || []).filter(task => task); // filter out undefined notes
    const connectDragSource = this.props.connectDragSource;
    const connectDragPreview = this.props.connectDragPreview;
    const connectDropTarget = this.props.connectDropTarget;

    return connectDragPreview(
      connectDropTarget(
        <div className="lane">
          <h2 className="lane__name">
            <Editable
              editing={lane.editing}
              id={lane._id}
              value={lane.name}
              onEdit={this.props.onEditLane}
              onValueClick={this.props.onEditLane}
            />
            <button
              className="lane__delete"
              onClick={this.handleDeleteLane}
            >-</button>
            {
              connectDragSource(
                <button className="lane__drag" />
              )
            }
          </h2>
          <Tasks
            tasks={laneTasks}
            onDeleteTask={this.handleDeleteTask}
            onEditTask={this.props.onEditTask}
            onValueClick={this.props.onEditTask}
            onMoveTask={this.props.onMoveTask}
          />
          <button className="add-note" onClick={this.handleCreateTask} >
            + task
          </button>
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
