import { Activities } from '../../../api/activities/activities';
import { Ideas } from '../../../api/ideas/ideas';
import { IdeaComments } from '../../../api/idea-comments/idea-comments';
import { Votes } from '../../../api/votes/votes';



Migrations.add({
    version: 2,
    up: function () {

        Meteor.users.find({}).forEach(user => {

            console.log('generating activity timeline for ideas');
            generateActivityTimelineForIdeas(user);

            console.log('generating activity timeline for idea comments');
            generateActivityTimelineForIdeaComments(user);

            console.log('generating activity timeline for idea likes/dislikes');
            generateActivityTimelineForIdeaEmotions(user);

        });
    }
});

function generateActivityTimelineForIdeas(user) {
    Ideas.find({ ownerId: user._id }).forEach(idea => {
        Activities.insert({
            type: 'ideas.create',
            body: idea.name,
            itemId: idea._id,
            itemOwnerId: idea.ownerId,
            ownerId: user._id,
            ownerName: user.profile.fullName,
            createdAt: idea.createdAt
        });
    });
}

function generateActivityTimelineForIdeaComments(user) {
    IdeaComments.find({ ownerId: user._id }).forEach(comment => {
        Activities.insert({
            type: 'ideas.comments.create',
            body: comment.text,
            itemId: comment._id,
            itemOwnerId: comment.ownerId,
            itemDetails: { ideaId: comment.ideaId },
            ownerId: user._id,
            ownerName: user.profile.fullName,
            createdAt: comment.createdAt,
            targetOwnerId: comment.getIdea().ownerId
        });
    });
}

function generateActivityTimelineForIdeaEmotions(user) {
    Votes.find({ ownerId: user._id }).forEach(vote => {
        Activities.insert({
            type: 'ideas.votes',
            body: '',
            itemId: vote._id,
            itemOwnerId: vote.ownerId,
            itemDetails: { ideaId: vote.ideaId, isUpVote: vote.isUpVote },
            ownerId: user._id,
            ownerName: user.profile.fullName,
            createdAt: vote.createdAt,
            targetOwnerId: vote.getIdea().ownerId
        });
    });
}