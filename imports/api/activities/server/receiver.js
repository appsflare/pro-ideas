import emitter from '../../events';
import { add } from '../methods';

const IDEAS_CREATE = 'ideas.create';
const IDEAS_COMMENTS_CREATE = 'ideas.comments.create';
const IDEAS_VOTES = 'ideas.votes';

emitter.on(IDEAS_CREATE, idea => {
    add({
        type: IDEAS_CREATE,
        body: idea.name,
        itemId: idea._id,
        itemOwnerId: idea.ownerId
    }, err => err => console.error(err));
});

emitter.on(IDEAS_COMMENTS_CREATE, comment => {    
    add({
        type: IDEAS_COMMENTS_CREATE,
        body: comment.text,
        itemId: comment._id,
        itemOwnerId: comment.ownerId,        
        itemDetails: { ideaId: comment.ideaId },
        targetOwnerId: comment.getIdea().ownerId
    }, err => err => console.error(err));
});

emitter.on(IDEAS_VOTES, vote => {    
    add({
        type: IDEAS_VOTES,
        body: '',
        itemId: vote._id,
        itemOwnerId: vote.ownerId,
        itemDetails: { ideaId: vote.ideaId, isUpVote: vote.isUpVote },
        targetOwnerId: vote.getIdea().ownerId
    }, err => err => console.error(err));
});