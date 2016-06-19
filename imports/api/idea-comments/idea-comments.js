import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import faker from 'faker';

import commentsCountDenormalizer from './commentsCountDenormalizer';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Ideas } from '../ideas/ideas';

class IdeaCommentsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    commentsCountDenormalizer.afterInsertComment(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    commentsCountDenormalizer.afterUpdateComment(selector, modifier);
    return result;
  }
  remove(selector) {
    const comments = this.find(selector).fetch();
    const result = super.remove(selector);
    commentsCountDenormalizer.afterRemoveComments(comments);
    return result;
  }
}

export const IdeaComments = new IdeaCommentsCollection('idea-comments')

IdeaComments.schema = new SimpleSchema({
  ideaId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  text: {
    type: String,
    denyUpdate: true,
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
    denyUpdate: true,
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
  ownerId: 1,
  ownerName: 1,
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'todo', 'emptyTodo', 'checkedTodo'
Factory.define('idea-comment', IdeaComments, {
  ideaId: () => Factory.get('ideas'),
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date(),
});

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
