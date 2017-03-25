import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Teams } from '../teams/teams.js'
import { Sprints } from './sprints.js'



function validateSprintName(name) {
  const count = Sprints.find({ name }).count()
  if (count > 1) {
    throw new Meteor.Error('sprint.name.alreadyExist', 'Sprint with the specified name already exist')
  }
}

const SPRINT_ID_ONLY = new SimpleSchema({
  sprintId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
  name: 'sprints.insert',
  validate: new SimpleSchema({
    name: { type: String },
    goals: { type: String },
    teamId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }).validator(),
  run({name,goals, teamId, startDate, endDate}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const team = Teams.findOne(teamId)

    if (!team) {
      throw new Meteor.Error('sprint.create.teamNotFound', 'team not found')
    }

    if (!team.editableBy(this.userId)) {
      throw new Meteor.Error('sprints.update.accessDenied',
        "You don't have permission to edit this team.")
    }  

    validateSprintName(name)

    const newSprint = { name, goals, teamId, startDate, endDate }
    newSprint.ownerId = this.userId 

    newSprint.createdAt = Date.now()


    return Sprints.insert(newSprint)
  },
})

export const update = new ValidatedMethod({
  name: 'sprints.update',
  validate: new SimpleSchema({
    sprintId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, optional: true },
    goals: { type: String, optional: true },
    startDate: { type: Date, optional: true },
    endDate: { type: Date, optional: true },
  }).validator(),
  run({sprintId, name, goals}) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const sprint = Sprints.findOne(sprintId)

    if (!sprint.editableBy(this.userId)) {
      throw new Meteor.Error('sprints.update.accessDenied',
        "You don't have permission to edit this sprint.")
    }

    if (name !== sprint.name) {
      validateSprintName(name)
    }

    const data = { name: name, goals: sprint.goals, startDate: sprint.startDate, endDate: sprint.endDate }

    if (goals) {
      data.goals = goals;
    }

    if (startDate) {
      data.startDate = startDate;
    }

    if (endDate) {
      data.endDate = endDate;
    }

    if(data.startDate >= data.endDate){
      throw new Meteor.Error('sprints.startDate.validation', 'Sprint start date cannot be ahead of end date')
    }  


    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Sprints.update(sprintId, {
      $set: data,
    })
  },
})


export const remove = new ValidatedMethod({
  name: 'sprints.remove',
  validate: SPRINT_ID_ONLY,
  run({ sprintId }) {
    if (!this.userId) { throw new Error('not-authorized'); }

    const sprint = Sprints.findOne(sprintId)

    if (!sprint.editableBy(this.userId)) {
      throw new Meteor.Error('sprints.remove.accessDenied',
        "You don't have permission to remove this sprint.")
    }

    Sprints.remove(sprintId)
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
