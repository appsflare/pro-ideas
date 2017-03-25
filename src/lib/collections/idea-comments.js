import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Ideas } from './ideas';

export const IdeaComments = new Mongo.Collection('idea-comments');

IdeaComments.schema = new SimpleSchema({
  ideaId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true
  },
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  },
  updatedOn: {
    type: Date,
    optional: true
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true
  }
});

// Deny all client-side updates since we will be using methods to manage this collection
IdeaComments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


IdeaComments.attachSchema(IdeaComments.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
IdeaComments.publicFields = {
  ideaId: 1,
  text: 1,
  ownerId: 1
};


IdeaComments.helpers({
  getIdea() {
    return Ideas.findOne(this.ideaId);
  },
  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  }
});