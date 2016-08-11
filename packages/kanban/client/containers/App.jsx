import React, { PropTypes } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import uuid from 'uuid';

import lanesActions from '../actions/lanes';
import { connect } from 'react-redux';
import Lanes from '../components/Lanes.jsx';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import {TaskStates} from '../../api/taskstates/taskstates';
import {Tasks} from '../../api/tasks/tasks';

class App extends React.Component {
  render() {
    return (
      <div className="react-kanban">
        <h1 className="app-title">Tasks</h1>
        <button
          className="add-lane hidden"
          onClick={this.props.onCreateLane}
          >
          + Lane
        </button>      
        <Lanes
          lanes={this.props.lanes}
          allTasks={this.props.allTasks}
          onEditLane={this.props.onEditLane}
          onDeleteLane={this.props.onDeleteLane}
          onMoveLane={this.props.onMoveLane}
          />
      </div>
    );
  }
}

App.propTypes = {
  lanes: PropTypes.array.isRequired,
  allTasks: PropTypes.array.isRequired,
  onCreateLane: PropTypes.func.isRequired,
  onDeleteLane: PropTypes.func.isRequired,
  onEditLane: PropTypes.func.isRequired,
  onMoveLane: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  lanes: state.lanes,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateLane() {
    dispatch(lanesActions.createLane('Active'));
  },

  onEditLane(laneId, name) {
    const updatedLane = {
      id: laneId,
    };

    if (name) {
      updatedLane.name = name;
      updatedLane.editing = false;
    } else {
      updatedLane.editing = true;
    }

    dispatch(lanesActions.updateLane(updatedLane));
  },

  onDeleteLane(laneId) {
    dispatch(lanesActions.deleteLane(laneId));
  },

  onMoveLane(sourceId, targetId) {
    dispatch(lanesActions.move('lane', sourceId, targetId));
  },
});


const AppContainer = createContainer(({onCreateLane, onDeleteLane, onEditLane, onMoveLane, onReset, boardId}) => {
  const taskStatesSub = Meteor.subscribe('taskstates.public', boardId);

  let allTasks = []

  let lanes = TaskStates.find({}, { limit: 10 }).fetch()

  let lanesSubReady = taskStatesSub.ready()

  if (lanes.length) {
    const tasksSub = Meteor.subscribe('tasks.public', lanes.map(lane => lane._id))
    if (tasksSub.ready()) {
      lanesSubReady = true
      allTasks = Tasks.find({ }).fetch()
    }
  }

  return {
    lanesSubReady,
    lanes,
    allTasks,
    onCreateLane, onDeleteLane, onEditLane, onMoveLane, onReset, boardId
  }
}, App)

export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);
