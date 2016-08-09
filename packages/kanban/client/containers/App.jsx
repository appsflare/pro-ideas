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
          className="add-lane"
          onClick={this.props.onCreateLane}
          >
          + Lane
        </button>
        <button
          className="reset-store"
          onClick={this.props.onReset}
          >
          Reset persisted store
        </button>
        <Lanes
          lanes={this.props.lanes}
          taksByLaneId={this.props.taksByLaneId}
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
  taksByLaneId: PropTypes.func.isRequired,
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


const AppContainer = createContainer(({onCreateLane, onDeleteLane, onEditLane, onMoveLane, onReset}) => {
  const taskStatesSub = Meteor.subscribe('taskstates.public');
  const tasksSub = Meteor.subscribe('tasks.public');

  let taksByLaneId = (id) => {
    return Tasks.find({ laneId: id }).fetch() || []
  }



  let lanes = TaskStates.find({}, { limit: 10 }).fetch();
  if (!lanes.length) {
    lanes = [
      {
        _id: uuid.v4(),
        name: 'Todo',
        description: '',
        tasks: 0
      },
      {
        _id: uuid.v4(),
        name: 'In Progress',
        description: '',
        tasks: 0
      },
      {
        _id: uuid.v4(),
        name: 'Review',
        description: '',
        tasks: 0
      }
    ];
  }

  return {
    lanesSubReady: taskStatesSub.ready(),
    tasksSubReady: tasksSub.ready(),
    lanes: lanes,
    taksByLaneId: taksByLaneId,
    onCreateLane, onDeleteLane, onEditLane, onMoveLane, onReset
  };
}, App);

export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);
