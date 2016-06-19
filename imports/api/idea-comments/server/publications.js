/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

import { IdeaComments } from '../idea-comments'

Meteor.publish('idea-comments.public', function (ideaId) {
  check(ideaId, String)
  return IdeaComments.find({ ideaId: ideaId }, { sort: { createdAt: -1 } })
})
