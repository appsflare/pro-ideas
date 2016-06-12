import { Mongo } from 'meteor/mongo'
export const Ideas = new Mongo.Collection('ideas')
import { check } from 'meteor/check'

Ideas.schema = new SimpleSchema({
  name: {
    type: String
  },
  businessValue: {
    type: String
  },
  definitionOfSuccess: {
    type: String
  },
  isFundingRequired: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  requiredFund: {
    type: Number,
    optional: true,
    defaultValue: 0
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

Ideas.publicKeys = ['name', 'description', 'createdAt', 'teamId', 'ownerId', 'ownerName']

if (Meteor.isServer) {
  Meteor.publish('ideas.public', function () {
    return Ideas.find({}, {  sort: { createdAt: -1 } })
  })
  Meteor.publish('ideas.public.findOne', function (ideaId) {
    return Ideas.find({_id: ideaId})
  })

  Meteor.methods({
    'ideas.insert'(args) {
      check(args, Object)

      if (! this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      let userEmail = Meteor.user().emails[0].address

      const idea = {
        name: args.name,
        businessValue: args.businessValue,
        definitionOfSuccess: args.definitionOfSuccess,
        isFundingRequired: args.isFundingRequired,
        requiredFund: args.requiredFund,
        createdAt: new Date(),
        ownerId: this.userId,
        ownerName: userEmail
      }

      Ideas.schema.validate(idea)

      Ideas.insert(idea)
    },
    'ideas.calcComments'(ideaId) {
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      let idea = Ideas.findOne(ideaId)

      if (!idea) {
        throw new Meteor.Error('idea-not-found')
      }

      let commentsCount = Meteor.call('idea-comments.getCount', ideaId)
      Ideas.update(ideaId, { $set: { comments: commentsCount }})
    },
    'ideas.calcVotes'(ideaId) {
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      let idea = Ideas.findOne(ideaId)

      if (!idea) {
        throw new Meteor.Error('idea-not-found')
      }

      let stats = Meteor.call('votes.getStats', ideaId)
      Ideas.update(ideaId, { $set: stats })

    },
    'ideas.update'(ideaId, data) {
      check(data, Object)
      check(data.name, String)
      check(data.description, String)

      const idea = Ideas.findOne(ideaId)

      if (!this.userId && idea.ownerId !== this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      Ideas.update(ideaId, {$set: { name: name, description: description }})
    },
    'ideas.remove'(ideaId) {
      check(ideaId, String)

      const idea = Ideas.findOne(ideaId)

      if (!this.userId && idea.ownerId !== this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      Ideas.remove(ideaId)
    }
  })
}
