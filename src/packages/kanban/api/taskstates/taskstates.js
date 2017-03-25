import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Tasks } from '../tasks/tasks';


class TaskStatesCollection extends Mongo.Collection {
  insert(lane, callback) {
    return super.insert(lane, callback);
  }
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const TaskStates = new TaskStatesCollection('kanaban-taskstates')

// Deny all client-side updates since we will be using methods to manage this collection
TaskStates.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
})

TaskStates.schema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String,
    defaultValue: ''
  },
  order: {
    type: Number
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  tasks: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
});

TaskStates.attachSchema(TaskStates.schema);

TaskStates.publicFields = {
  name: 1,
  description: 1,
  order:1,
  tasks: 1,
  createdAt: 1,
  updatedAt: 1,
  boardId: 1,
  ownerId: 1
};


TaskStates.helpers({
  // A Idea is considered to be private if it has a userId set
  isPrivate() {
    return !!this.ownerId
  },
  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  },  
  tasks() {
    return Tasks.find({ laneId: this._id }, { sort: { createdAt: -1 } })
  },
});