/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor'

import { Teams } from '../teams.js'

Meteor.publish('teams.public', function () {
  return Teams.find({}, { fields: Teams.publicFields, sort: { createdAt: -1 } })
})
Meteor.publish('teams.public.findOne', function (ideaId) {
  return Teams.find({ideaId}, { fields: Teams.publicFields})
})

Meteor.publish('account.allusers', function (ideaId) {
  return Meteor.users.find({}, {fields: {profile: 1,_id: 1}})
})
