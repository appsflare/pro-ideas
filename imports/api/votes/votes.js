import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Factory } from 'meteor/factory';
import faker from 'faker';

import votesCountDenormalizer from './votesCountDenormalizer';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';




class VotesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    votesCountDenormalizer.afterInsertVote(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    votesCountDenormalizer.afterUpdateVote(selector, modifier);
    return result;
  }
  remove(selector) {
    const comments = this.find(selector).fetch();
    const result = super.remove(selector);
    votesCountDenormalizer.afterRemoveVotes(comments);
    return result;
  }
}

export const Votes = new VotesCollection('votes')

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
    denyUpdate: true,
  }
});

Votes.attachSchema(Votes.schema)

// Deny all client-side updates since we will be using methods to manage this collection
Votes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Factory.define('Vote', Votes, {})