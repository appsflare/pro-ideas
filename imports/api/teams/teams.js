import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Factory } from 'meteor/factory'
import { Ideas } from '../ideas/ideas'

class TeamsCollection extends Mongo.Collection {
  insert (team, callback) {
    const ourTeam = team
    return super.insert(ourTeam, callback)
  }
  remove (selector, callback) {
    return super.remove(selector, callback)
  }
}

export const Teams = new TeamsCollection('Teams')

// Deny all client-side updates since we will be using methods to manage this collection
Teams.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
})

Teams.schema = new SimpleSchema({
  name: {
    type: String
  },
  'members.$.memberId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'members.$.memberName': {
    type: String
  },
  ideaId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
})

Teams.attachSchema(Teams.schema)

Teams.publicFields = {
  name: 1,
  ideaId: 1,
  members: 1,
  createdAt: 1,
  ownerId: 1
}

Factory.define('Team', Teams, {})

Teams.helpers({
  owner() {
    let {_id, profile} = Meteor.users.findOne(this.ownerId)
    return { _id, profile}
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
