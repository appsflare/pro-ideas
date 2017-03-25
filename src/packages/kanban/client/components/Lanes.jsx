import React, { PropTypes } from 'react';
import Lane from '../containers/Lane.jsx';

export default class Lanes extends React.Component {
  render() {
    const {allTasks} = this.props;
    const lanes = this.props.lanes.map(lane => {

      let isLastLane = lane.order === (this.props.lanes.length - 1);

      return <Lane
        key={lane._id}
        lane={lane}
        canAddTask={!isLastLane}
        tasks={allTasks.filter(task => task.state === lane._id) }
        onEditLane={this.props.onEditLane}
        onDeleteLane={this.props.onDeleteLane}
        onMoveLane={this.props.onMoveLane}
        />
    });

    return (
      <div className="lanes">
        {lanes}
      </div>
    );
  }
}

Lanes.propTypes = {
  lanes: PropTypes.array.isRequired,
  allTasks: PropTypes.array.isRequired,
  onEditLane: PropTypes.func.isRequired,
  onDeleteLane: PropTypes.func.isRequired,
  onMoveLane: PropTypes.func.isRequired,
};
