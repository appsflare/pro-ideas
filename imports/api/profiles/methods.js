import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';


import { Profiles } from './profiles.js';

function validateUserName(userName) {
  const count = Profiles.find({ userName }).count()
  if (count > 1) {
    throw new Meteor.Error('profile.userName.alreadyExist', 'Profile name is not available')
  }
}

export const update = new ValidatedMethod({
  name: 'profiles.update',
  validate: new SimpleSchema({
    userName: { type: String },    
    location: { type: String, optional: true }
  }).validator(),
  run({userName, location, skills}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    validateUserName(userName)

    return Profiles.upsert({ ownerId: this.userId }, {
      $set: {
        userName,
        location,        
        ownerId: this.userId
      }
    });
  },
});

// Get list of all method names on ideas
const profiles_METHODS = _.pluck([

  update
], 'name')

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(profiles_METHODS, name)
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000)
}
