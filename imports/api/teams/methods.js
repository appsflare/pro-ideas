import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Teams } from './teams.js'

const TEAM_ID_ONLY = new SimpleSchema({
  teamId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
  name: 'teams.insert',
  validate: new SimpleSchema({
    name: { type: String },
    ideaId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    createdAt: {
      type: Date
    },
    memebers: {
      type: Array
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run(newteam) {
    if (!this.userId) { throw new Error('not-authorized'); }

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.")
    }

    newteam.ownerId = this.userId
    newteam.ownerName = Meteor.user().profile.fullName
    newteam.createdAt = Date.now()
    newteam.members = Meteor.users()
      .find({members: {$in: newteam.members}}, {fields: {_id: 1, profile: 1}})
      .map(member => {
        return {memberName: user.profile.name, memberId: user._id}
      })

    return Teams.insert(newteam)
  },
})

export const update = new ValidatedMethod({
  name: 'teams.update',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, optional: true }
  }).validator(),
  run(data) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.")
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Teams.update(teamId, {
      $set: data,
    })
  },
})

export const addMember = new ValidatedMethod({
  name: 'teams.addMember',
  validate: new SimpleSchema({
    'teamId': { type: String, regEx: SimpleSchema.RegEx.Id },
    'userId': { type: String, regEx: SimpleSchema.RegEx.Id }
  }).validator(),
  run({teamId, userId}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.")
    }

    const userToAdd = Meteor.users.findOne(userId)

    if (!userToAdd) {
      throw new Error('user not found')
    }

    if (!_.contains(team.members, userToAdd._id)) {
      team.members.push({memberName: userToAdd.profile.fullName,memberId: userToAdd._id})
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Teams.update(teamId, {
      $set: { members: team.members }
    })
  },
})

export const removeMember = new ValidatedMethod({
  name: 'teams.removeMember',
  validate: new SimpleSchema({
    'teamId': { type: String, regEx: SimpleSchema.RegEx.Id },
    'userId': { type: String, regEx: SimpleSchema.RegEx.Id }
  }).validator(),
  run({teamId, userId}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.")
    }

    const userToRemove = Meteor.users.findOne(userId)

    if (!userToRemove) {
      throw new Error('user not found')
    }

    if (!_.contains(team.members, userToRemove._id)) {
      throw new Error('user not a member already')
    }

    const memberToRemove = _.findWhere(team.members, {memberId: userToRemove._id})
    const index = team.members.indexOf(memberToRemove)

    team.members.splice(index, 1)

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Teams.update(teamId, {
      $set: { members: team.members }
    })
  },
})

export const remove = new ValidatedMethod({
  name: 'teams.remove',
  validate: TEAM_ID_ONLY,
  run({ teamId }) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.remove.accessDenied',
        "You don't have permission to remove this team.")
    }

    Teams.remove(teamId)
  }
})

// Get list of all method names on teams
const teams_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name')

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(teams_METHODS, name)
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000)
}
