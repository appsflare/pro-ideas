import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'

import { IdeaComments } from './idea-comments.js'
import { Ideas } from '../ideas/ideas.js'

const commentsCountDenormalizer = {
  _updateIdea(ideaId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const comments = IdeaComments.find({ ideaId }).count()

    Ideas.update(ideaId, { $set: { comments} })
  },
  afterInsertComment(comment) {
    this._updateIdea(comment.ideaId);
  },
  afterUpdateComment(selector, modifier) {
    // We only support very limited operations on todos
    check(modifier, { $set: Object })
    
  },
  // Here we need to take the list of todos being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)
  afterRemoveComments(comments) {
    comments.forEach(comment => this._updateList(comment.ideaId))
  },
}

export default commentsCountDenormalizer
