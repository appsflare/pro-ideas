import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'

import { Votes } from './votes'
import { Ideas } from '../ideas/ideas'

function getVotesCount (ideaId, isUpVote) {  
  return Votes.find({ ideaId, isUpVote}).count()
}

const votesCountDenormalizer = {
  _updateIdea(ideaId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const stats = { upVotes: getVotesCount(ideaId, true), downVotes: getVotesCount(ideaId, false)}
    Ideas.update(ideaId, { $set: stats })
  },
  afterInsertVote(vote) {
    this._updateIdea(vote.ideaId)
  },
  afterUpdateVote(selector, modifier) {
    // We only support very limited operations on todos
    check(modifier, { $set: Object })

    let votes = Votes.find(selector)
    votes.forEach(vote => this._updateIdea(vote.ideaId))
  },
  // Here we need to take the list of todos being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)
  afterRemoveVotes(votes) {
    votes.forEach(vote => this._updateIdea(vote.ideaId))
  },
}

export default votesCountDenormalizer
