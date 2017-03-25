import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Ideas } from '/lib/collections/ideas.js'
import { Teams } from '/lib/collections/teams.js'

function validateTeamName (name) {
  const count = Teams.find({name}).count()
  if (count > 1) {
    throw new Meteor.Error('team.name.alreadyExist', 'Team with the specified name already exist')
  }
}

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
    'members.$.memberId': {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({name, ideaId, members}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const idea = Ideas.findOne(ideaId)

    if (!idea) {
      throw new Meteor.Error('team.create.ideaNotFound', 'idea not found')
    }

    if (!idea.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.");
    }

    const existingTeam = Teams.findOne({ideaId})
    if (existingTeam) {
      throw new Meteor.Error('teams.insert.alreadyExist',
        'The team is already been formed for this idea, please delete the existing team.')
    }

    validateTeamName(name)

    const newteam = {name,ideaId}
    newteam.ownerId = this.userId
    newteam.ownerName = Meteor.user().profile.fullName
    newteam.createdAt = Date.now()
    newteam.members = Meteor.users
      .find({_id: {$in: members.map(mem => mem.memberId)}}, {fields: {_id: 1, profile: 1}})
      .fetch()
      .map(member => {
        return {memberName: member.profile.fullName, memberId: member._id}
      })

    return Teams.insert(newteam);
  },
})

export const update = new ValidatedMethod({
  name: 'teams.update',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, optional: true },
    'members.$.memberId': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  }).validator(),
  run({teamId, name, members}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.")
    }

    if (name !== team.name) {
      validateTeamName(name)
    }
    
    const data = { name: name}

    if (members) {
      data.members = Meteor.users
        .find({_id: {$in: members.map(mem => mem.memberId)}}, {fields: {_id: 1, profile: 1}})
        .fetch()
        .map(member => {
          return {memberName: member.profile.fullName, memberId: member._id}
        });
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

    const team = Teams.findOne(teamId);

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.update.accessDenied',
        "You don't have permission to edit this team.");
    }

    const userToAdd = Meteor.users.findOne(userId);

    if (!userToAdd) {
      throw new Error('user not found');
    }

    if (!_.contains(team.members, userToAdd._id)) {
      team.members.push({memberName: userToAdd.profile.fullName,memberId: userToAdd._id});
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Teams.update(teamId, {
      $set: { members: team.members }
    });
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
        "You don't have permission to edit this team.");
    }

    const userToRemove = Meteor.users.findOne(userId);

    if (!userToRemove) {
      throw new Error('user not found');
    }

    if (!_.contains(team.members, userToRemove._id)) {
      throw new Error('user not a member already');
    }

    const memberToRemove = _.findWhere(team.members, {memberId: userToRemove._id});
    const index = team.members.indexOf(memberToRemove);

    team.members.splice(index, 1);

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Teams.update(teamId, {
      $set: { members: team.members }
    })
  }
})

export const remove = new ValidatedMethod({
  name: 'teams.remove',
  validate: TEAM_ID_ONLY,
  run({ teamId }) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId);

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('teams.remove.accessDenied',
        "You don't have permission to remove this team.");
    }

    Teams.remove(teamId);
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
      return _.contains(teams_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
