import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'

import { getFollowersCount, getFollowingCount } from './methods'
import { Profiles } from '../profiles/profiles.js'

const followersCountDenormalizer = {
  _updateProfile(ownerId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const comments = Profiles.findOne({ ownerId });

    Profiles.update(ownerId, { $set: { comments} })
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
    comments.forEach(comment => this._updateIdea(comment.ideaId))
  },
}

export default followersCountDenormalizer
