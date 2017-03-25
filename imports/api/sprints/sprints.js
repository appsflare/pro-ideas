import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Factory } from 'meteor/factory'
import { Teams } from '../teams/teams'

class SprintsCollection extends Mongo.Collection {
  insert(sprint, callback) {
    const thisSprint = sprint
    return super.insert(thisSprint, callback)
  }
  remove(selector, callback) {
    return super.remove(selector, callback)
  }
}

export const Sprints = new SprintsCollection('sprints')

// Deny all client-side updates since we will be using methods to manage this collection
Sprints.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
})

Sprints.schema = new SimpleSchema({
  name: {
    type: String
  },
  goals:{
    type: String
  },
  teamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true
  },
  startDate: {
    type: Date
  },
  status:{
    type: String,
    defaultValue: 'created'
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
})

Sprints.attachSchema(Sprints.schema)

Sprints.publicFields = {
  name: 1,
  teamId: 1,
  goals: 1,
  status: 1,
  startDate: 1,
  endDate: 1,
  createdAt: 1,
  ownerId: 1
}

Factory.define('Sprint', Sprints, {})

Sprints.helpers({
  getOwner() {
    let {_id, profile} = Meteor.users.findOne(this.ownerId)
    return { _id, profile }
  },
  getIdea() {
    return Ideas.findOne(this.ideaId)
  },
  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  }
})
