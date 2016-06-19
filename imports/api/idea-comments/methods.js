import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { IdeaComments } from './idea-comments';
import { Ideas } from '../ideas/ideas';


export const insert = new ValidatedMethod({
  name: 'idea-comments.insert',
  validate: new SimpleSchema({
    ideaId: { type: String },
    text: { type: String },
  }).validator(),
  run({ ideaId, text }) {
    const list = Ideas.findOne(ideaId);

  const idea = Ideas.findOne(ideaId)
      if (!idea) {
        throw new Meteor.Error('idea-not-found')
      }

      const ownerName = Meteor.user().profile.fullName;

      IdeaComments.insert({ideaId, text, ownerId: this.userId, ownerName: ownerName})
  }
});

export const updateText = new ValidatedMethod({
  name: 'idea-comments.updateText',
  validate: new SimpleSchema({
    ideaId: { type: String },
    text: { type: String },
  }).validator(),
  run({ ideaId, newText }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const ideaComment = IdeaComments.findOne(ideaId);

    if (!ideaComment.editableBy(this.userId)) {
      throw new Meteor.Error('ideaComments.updateText.accessDenied',
        'Cannot edit comment that is not yours');
    }

    IdeaComments.update(ideaId, {
      $set: { text: newText },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'idea-comments.remove',
  validate: new SimpleSchema({
    commentId: { type: String },
  }).validator(),
  run({ commentId }) {
    const comment = IdeaComments.findOne(commentId);

    if (!comment.editableBy(this.userId)) {
      throw new Meteor.Error('ideaComments.remove.accessDenied',
        'Cannot remove comment that is not yours');
    }

    IdeaComments.remove(commentId);
  },
});

// Get list of all method names on Todos
const IDEA_COMMENTS_METHODS = _.pluck([
  insert,  
  updateText,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(IDEA_COMMENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
