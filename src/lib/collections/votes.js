import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import emitter from '../events';

import { Ideas } from './ideas';


class VotesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);    

    emitter.emit('ideas.votes', super.findOne({ _id: result }));

    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);   

    emitter.emit('ideas.votes', super.findOne(selector));

    return result;
  }  
}

export const Votes = new VotesCollection('votes');

Votes.schema = new SimpleSchema({
  ideaId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  isUpVote: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  ownerName: {
    type: String,
    denyUpdate: true
  }
});

Votes.attachSchema(Votes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Votes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Votes.helpers({
  getIdea() {
    return Ideas.findOne(this.ideaId);
  }
});
