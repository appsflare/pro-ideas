import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { Ideas } from './ideas'

const _ideaCommentNotifications = {
  _onInsert(comment) {
    console.log(comment);
    Meteor.call('ideas.calcComments', comment.ideaId)
  },

  _onRemove(comment) {
    Meteor.call('ideas.calcComments', comment.ideaId)
  }
}

class IdeaCommentsCollection extends Mongo.Collection {

  insert(comment, callback) {
    const res = super.insert(comment, callback)

    _ideaCommentNotifications._onInsert(comment, callback)

    return res

  }

  remove(commentId, callback) {
    const comment = super.findOne(commentId);
    const res = super.remove(commentId, callback)
    _ideaCommentNotifications._onRemove(comment, callback)
    return res
  }

}

export const IdeaComments = new IdeaCommentsCollection('idea-comments')

IdeaComments.schema = new SimpleSchema({
  ideaId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  text: {
    type: String
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
  }
})

IdeaComments.attachSchema(IdeaComments.schema)

IdeaComments.publicKeys = ['ideaId', 'text', 'createdAt', 'ownerId']

if (Meteor.isServer) {
  Meteor.publish('idea-comments.public', function (ideaId) {
    check(ideaId, String)    
    return IdeaComments.find({ ideaId: ideaId }, { sort: { createdAt: -1 } })
  })

  Meteor.methods({
    'idea-comments.getCount'(ideaId) {
      return IdeaComments.find({ ideaId: ideaId}).count()
    },

    'idea-comments.insert'(ideaId, text) {
      check(ideaId, String)
      check(text, String)

      if (! this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      const idea = Ideas.findOne(ideaId)
      if (!idea) {
        throw new Meteor.Error('idea-not-found')
      }

      let userEmail = Meteor.user().emails[0].address

      IdeaComments.insert({ideaId, text, createdAt: Date.now(), ownerId: this.userId, ownerName: userEmail})
    },
    'idea-comments.update'(commentId, text) {
      check(commentId, String)
      check(text, String)

      const comment = IdeaComments.findOne(commentId)
      if (!comment) {
        throw new Meteor.Error('idea-comment-not-found')
      }

      if (!this.userId && comment.ownerId !== this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      IdeaComments.update(commentId, {$set: { text}})

    },
    'idea-comments.remove'(commentId) {
      check(commentId, String)

      const comment = IdeaComments.findOne(commentId)

      if (!this.userId && comment.ownerId !== this.userId) {
        throw new Meteor.Error('not-authorized')
      }

      IdeaComments.remove(commentId)
    }
  })
}
