import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'
import Kanban  from 'meteor/pro-ideas:kanban'

import { Ideas } from './ideas.js'

function validateIdeaName(name) {
  const count = Ideas.find({ name }).count()
  if (count > 1) {
    throw new Meteor.Error('idea.name.alreadyExist', 'Idea with the specified name already exist')
  }
}

const IDEA_ID_ONLY = new SimpleSchema({
  ideaId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
  name: 'ideas.insert',
  validate: new SimpleSchema({
    name: { type: String, optional: true },
    businessValue: { type: String, optional: true },
    definitionOfSuccess: { type: String, optional: true },
    fundingRequirement: { type: String, optional: true }
  }).validator(),
  run(newIdea) {
    if (!this.userId) { throw new Error('not-authorized'); }

    validateIdeaName(newIdea.name)

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
    fundingRequirement: { type: String, optional: true },
  }).validator(),
  run(data) {
    const ideaId = data.ideaId
    const idea = Ideas.findOne(ideaId)

    if (!idea.editableBy(this.userId)) {
      throw new Meteor.Error('ideas.update.accessDenied',
        "You don't have permission to edit this idea.")
    }

    if (idea.name !== data.name) {
      validateIdeaName(data.name)
    }
    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Ideas.update(ideaId, {
      $set: data,
    })
  },
})

export const markAsCompleted = new ValidatedMethod({
  name: 'ideas.markAsCompleted',
  validate: IDEA_ID_ONLY,
  run({ ideaId }) {
    const idea = Ideas.findOne(ideaId)

    if (!idea.editableBy(this.userId)) {
      throw new Meteor.Error('ideas.remove.accessDenied',
        "You don't have permission to mark this idea as completed.")
    }

    Ideas.update(ideaId, {
      $set: { status: 'completed' }
    })
  }
})

export const createKanbanBoard = new ValidatedMethod({
  name: 'ideas.createKanbanBoard',
  validate: IDEA_ID_ONLY,
  run({ ideaId }) {
    const idea = Ideas.findOne(ideaId)

    if (!idea.editableBy(this.userId)) {
      throw new Meteor.Error('ideas.remove.accessDenied',
        "You don't have permission to mark this idea as completed.")
    }

    if (idea.hasKanbanBoard()) {
      return idea.kanbanBoardId
    }

    if (Meteor.isServer) {
      const kanbanBoardId = Kanban.getBoardId(idea._id)

      Ideas.update(ideaId, {
        $set: { kanbanBoardId }
      })

      return kanbanBoardId
    }
  }
})

export const remove = new ValidatedMethod({
  name: 'ideas.remove',
  validate: IDEA_ID_ONLY,
  run({ ideaId }) {
    const idea = Ideas.findOne(ideaId)

    if (!idea.editableBy(this.userId)) {
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
  markAsCompleted,
  createKanbanBoard
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
