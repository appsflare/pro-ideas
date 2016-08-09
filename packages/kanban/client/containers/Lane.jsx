import Lane from '../components/Lane.jsx';
import lanesActions from '../actions/lanes';
import notesActions from '../actions/notes';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import * as itemTypes from '../constants/itemTypes';

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
    if((!targetProps.lane.tasks.length) && sourceType === itemTypes.TASK) {
      targetProps.attachToLane(targetId, sourceId);
    } else if((targetId !== sourceId) && (sourceType === itemTypes.LANE)) {
      targetProps.onMoveLane(sourceId, targetId);
    }
  },
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
  onCreateTask(laneId) {
    const newNote = notesActions.createNote('New task');
    dispatch(newNote);
    dispatch(lanesActions.attachToLane(laneId, newNote.payload.id));
  },

  // Used both to detach a note from a lane and delete all the notes when a
  // lane is removed
  onDeleteTask(laneId, noteId) {
    dispatch(notesActions.deleteNote(noteId));

    if(laneId) {
      dispatch(lanesActions.detachFromLane(laneId, noteId));
    }
  },

  onEditTask(noteId, value) {
    const updatedNote = {
      id: noteId,
    };

    if(value) {
      updatedNote.text = value;
      updatedNote.editing = false;
    } else {
      updatedNote.editing = true;
    }

    dispatch(notesActions.updateNote(updatedNote));
  },

  onMoveTask(sourceId, targetId) {
    dispatch(lanesActions.move('note', sourceId, targetId));
  },

  attachToLane(laneId, noteId) {
    dispatch(lanesActions.attachToLane(laneId, noteId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DragSource(itemTypes.LANE, laneSource, collectDragSource)(
    DropTarget([itemTypes.TASK, itemTypes.LANE], laneTarget, collectDropTarget)(Lane)
  )
);
