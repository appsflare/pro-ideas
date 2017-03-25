import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Teams } from './teams';

import emitter from '../events';

class IdeasCollection extends Mongo.Collection {
  insert(idea, callback) {    
    
    const result = super.insert(idea, callback);
    emitter.emit('ideas.create', super.findOne({ _id: result }));
    return result;
  }
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Ideas = new IdeasCollection('Ideas');

// Deny all client-side updates since we will be using methods to manage this collection
Ideas.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Ideas.schema = new SimpleSchema({
  name: {
    type: String
  },
  businessValue: {
    type: String,
    defaultValue: ''
  },
  definitionOfSuccess: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  fundingRequirement: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  createdAt: {
    type: Date
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  status: {
    type: String,
    allowedValues: ['new', 'completed'],
    defaultValue: 'new'
  },
  kanbanBoardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  comments: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  upVotes: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  downVotes: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
});

Ideas.attachSchema(Ideas.schema);

Ideas.publicFields = {
  name: 1,
  businessValue: 1,
  definitionOfSuccess: 1,
  fundingRequirement: 1,
  createdAt: 1,
  ownerId: 1,  
  status: 1,
  kanbanBoardId: 1,
  comments: 1,
  upVotes: 1,
  downVotes: 1
};



Ideas.helpers({
  // A Idea is considered to be private if it has a userId set
  isPrivate() {
    return !!this.ownerId
  },
  isCompleted() {
    return this.status === 'completed';
  },
  getTeam() {
    return Teams.find({ ideaId: this._id })
  },
  hasKanbanBoard(userId) {
    return !!this.kanbanBoardId
  },
  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  }
});
