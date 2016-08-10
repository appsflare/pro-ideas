import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Factory } from 'meteor/factory'

class TasksCollection extends Mongo.Collection {
  insert(lane, callback) {
    return super.insert(lane, callback)
  }
  remove(selector, callback) {
    return super.remove(selector, callback)
  }
}

export const Tasks = new TasksCollection('kanaban-tasks')

// Deny all client-side updates since we will be using methods to manage this collection
Tasks.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
})

Tasks.schema = new SimpleSchema({
  title: {
    type: String
  },
  details: {
    type: String,
    defaultValue: ''
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  lockedBy: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id
  },
  laneId: {
    type: SimpleSchema.RegEx.Id
  }
})

Tasks.attachSchema(Tasks.schema)

Tasks.publicFields = {
  name: 1,
  details: 1,
  laneId: 1,
  createdBy: 1,
  lockedBy: 1,
  createdAt: 1,
  updatedAt: 1,
  ownerId: 1
}

Factory.define('Task', Tasks, {})

Tasks.helpers({
  // A Idea is considered to be private if it has a userId set
  isLocked() {
    return !!this.lockedBy
  },
  editableBy(userId) {
    return this.lockedBy ? this.lockedBy === userId : true
  }
})
