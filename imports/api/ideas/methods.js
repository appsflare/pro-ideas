import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Ideas } from './ideas.js'

const IDEA_ID_ONLY = new SimpleSchema({
  ideaId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
  name: 'ideas.insert',
  validate: new SimpleSchema({
    name: { type: String, optional: true },
    businessValue: { type: String, optional: true },
    definitionOfSuccess: { type: String, optional: true },
    requiredFund: { type: Number, optional: true }
  }).validator(),
  run(newIdea) {
    if (!this.userId) {throw new Error('not-authorized');}

    newIdea.ownerId = this.userId
    newIdea.ownerName = Meteor.user().profile.fullName
    newIdea.createdAt = Date.now()
    return Ideas.insert(newIdea)
  },
})

export const update = new ValidatedMethod({
  name: 'ideas.update',
  validate: new SimpleSchema({
    ideaId: { type: String },
    name: { type: String, optional: true },
    businessValue: { type: String, optional: true },
    definitionOfSuccess: { type: String, optional: true },
    requiredFund: { type: Number, optional: true },
  }).validator(),
  run(data) {
    const idea = Ideas.findOne(ideaId)

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('ideas.update.accessDenied',
        "You don't have permission to edit this idea.")
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Ideas.update(ideaId, {
      $set: data,
    })
  },
})

export const remove = new ValidatedMethod({
  name: 'ideas.remove',
  validate: IDEA_ID_ONLY,
  run({ ideaId }) {
    const list = Ideas.findOne(ideaId)

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('ideas.remove.accessDenied',
        "You don't have permission to remove this idea.")
    }

    Ideas.remove(ideaId)
  }
})

// Get list of all method names on ideas
const ideas_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name')

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ideas_METHODS, name)
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000)
}
