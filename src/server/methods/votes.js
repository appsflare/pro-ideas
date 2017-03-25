import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Votes } from '/lib/collections/votes';
import { Ideas } from '/lib/collections/ideas';

export const cast = new ValidatedMethod({
  name: 'votes.cast',
  validate: new SimpleSchema({
    ideaId: { type: String },
    isUpVote: { type: Boolean }
  }).validator(),
  run({ ideaId, isUpVote }) {
    const idea = Ideas.findOne(ideaId);
    if (!idea) {
      throw new Meteor.Error('idea-not-found');
    }

    let castedVote = Votes.findOne({ ideaId, ownerId: this.userId });
    if (!castedVote) {
      const ownerName = Meteor.user().profile.fullName;
      const ownerId = this.userId;
      const vote = {ideaId, isUpVote, ownerId, ownerName};
      Votes.insert(vote);
    } else {
      Votes.update({_id: castedVote._id}, { $set: { isUpVote} });
    }
  }
})

// Get list of all method names on Todos
const VOTES_METHODS = _.pluck([ cast ], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(VOTES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
