import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Factory } from 'meteor/factory'

class IdeasCollection extends Mongo.Collection {
  insert (Idea, callback) {
    const ourIdea = Idea
    if (!ourIdea.name) {
      let nextLetter = 'A'
      ourIdea.name = `Idea ${nextLetter}`

      while (!!this.findOne({ name: ourIdea.name })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)
        ourIdea.name = `Idea ${nextLetter}`
      }
    }

    return super.insert(ourIdea, callback)
  }
  remove (selector, callback) {    
    return super.remove(selector, callback)
  }
}

export const Ideas = new IdeasCollection('Ideas')

// Deny all client-side updates since we will be using methods to manage this collection
Ideas.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
})

Ideas.schema = new SimpleSchema({
  name: {
    type: String
  },
  businessValue: {
    type: String
  },
  definitionOfSuccess: {
    type: String,
    optional: true
  },  
  fundingRequirement: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  createdAt: {
    type: Date
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  ownerName: {
    type: String
  },
  comments: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  upVotes: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  downVotes: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
})

Ideas.attachSchema(Ideas.schema)


Ideas.publicFields = {
  name: 1,
  businessValue: 1,
  definitionOfSuccess: 1,
  fundingRequirement: 1,
  createdAt: 1,
  ownerId: 1,
  ownerName: 1,
  comments: 1,
  upVotes: 1,
  downVotes: 1
}

Factory.define('Idea', Ideas, {})

Ideas.helpers({
  // A Idea is considered to be private if it has a userId set
  isPrivate() {
    return !!this.ownerId
  },
  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  },
  comments() {
    return Comments.find({ ideaId: this._id }, { sort: { createdAt: -1 } })
  },
})
