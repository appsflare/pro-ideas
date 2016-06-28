/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor'

import { Sprints } from '../sprints.js'

Meteor.publish('sprints.public', function () {
  return Sprints.find({}, { fields: Sprints.publicFields, sort: { createdAt: 1 } })
})
Meteor.publish('sprints.forTeam', function (teamId) {  
  return Sprints.find({ teamId }, { fields: Sprints.publicFields })
})
Meteor.publish('sprints.public.findOne', function (sprintId) {
  return Sprints.find({ _id: sprintId }, { fields: Sprints.publicFields })
})
