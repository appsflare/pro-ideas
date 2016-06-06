import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Votes = new Mongo.Collection('votes');

function getVotesCount(ideaId, isUpvote) {
    return Votes.find({ idea: ideaId, isUpVote: isUpvote }).count();
}


Meteor.methods({
    'votes.getStats'(ideaId) {
        return { upVotes: getVotesCount(ideaId, true), downVotes: getVotesCount(ideaId, false) };
    },
    'votes.cast'(ideaId, isUpVote) {

        check(isUpVote, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }


        let castedVote = Votes.findOne({ idea: ideaId, user: this.userId });
        if (!castedVote) {
            Votes.insert({ idea: ideaId, user: this.userId, isUpVote: isUpVote });
        } else {            
            Votes.update(castedVote._id, { $set: { idea: ideaId, isUpVote: isUpVote } });
        }

        Meteor.call('ideas.calcVotes', ideaId);
    }
});