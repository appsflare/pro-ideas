import Lane from '../components/Lane.jsx';
import lanesActions from '../actions/lanes';
import tasksActions from '../actions/tasks';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import * as itemTypes from '../constants/itemTypes';
import {insert, updateTitle, updateState, remove} from '../../api/tasks/methods'
import {update as updateLane} from '../../api/taskstates/methods'

const laneSource = {
  beginDrag(props) {
    const item = {
      id: props.lane.id,
    };

    return item;
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
};

const laneTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    const sourceType = monitor.getItemType();
    if ((!targetProps.lane.tasks.length) && sourceType === itemTypes.TASK) {
      targetProps.attachToLane(targetId, sourceId);
    } else if ((targetId !== sourceId) && (sourceType === itemTypes.LANE)) {
      targetProps.onMoveLane(sourceId, targetId);
    }
  },

  drop(targetProps, monitor, component) {
    const targetId = targetProps.lane._id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    targetProps.attachToLane(targetId, sourceId);
  }
};

const collectDragSource = (DnDconnect, monitor) => ({
  connectDragSource: DnDconnect.dragSource(),
  connectDragPreview: DnDconnect.dragPreview(),
  isDragging: monitor.isDragging(),
});

const collectDropTarget = (DnDconnect) => ({
  connectDropTarget: DnDconnect.dropTarget(),
});

const mapStateToProps = (state) => ({
  allNotes: state.notes,
});

const mapDispatchToProps = (dispatch) => ({

  onCreateTask(stateId) {
    insert.call({ stateId, title: 'New Task' }, (err, res) => {
      if (err)
      { console.error(err) }
    })
  },

  // Used both to detach a note from a lane and delete all the notes when a
  // lane is removed
  onDeleteTask(laneId, taskId) {

    remove.call({ taskId }, (err, res) => {
      if (err)
      { console.error(err) }
    })

    // dispatch(tasksActions.deleteTask(taskId));

    // if (laneId) {
    //   dispatch(lanesActions.detachFromLane(laneId, taskId));
    // }
  },

  onEditTask(taskId, title) {
    const updatedTask = {
      id: taskId,
    };

    if (title) {
      updateTitle.call({ taskId, title }, (err, res) => {
        if (err) {
          console.error(err);
        }
      })
    }
  },

  onMoveTask(sourceId, targetId) {
    dispatch(lanesActions.move('note', sourceId, targetId));
  },

  attachToLane(stateId, taskId) {
    if (!stateId) {
      return
    }
    updateState.call({ stateId, taskId }, (err, res) => {
      if (err) {
        console.error(err)
      }
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DragSource(itemTypes.LANE, laneSource, collectDragSource)(
    DropTarget([itemTypes.TASK, itemTypes.LANE], laneTarget, collectDropTarget)(Lane)
  )
);
