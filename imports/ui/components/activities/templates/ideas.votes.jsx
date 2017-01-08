import React, { Component, PropTypes } from 'react';
import { registerTemplate } from './templateStore';

class IdeasVoteActivity extends Component {

    constructor() {
        super(...arguments);
    }

    get currentUser() {
        return Meteor.userId();
    }

    render() {
        const {ownerId, ownerName, _id, itemId, body, createdAt, itemDetails: { ideaId, isUpVote }} = this.props.activity;

        return <li key={_id}>
            <i className={`fa ${isUpVote ? 'fa-thumbs-up' : 'fa-thumbs-down'} bg-blue`}></i>
            <div className="timeline-item">
                <span className="time"><i className="fa fa-clock-o" /> {moment(createdAt).fromNow()}</span>
                <h3 className="timeline-header"><a href={`/profile/${ownerId}`}>{this.currentUser == ownerId ? 'You' : ownerName}</a> {isUpVote ? 'liked' : 'disliked'}  an <a href={`/idea/${ideaId}`}> idea</a></h3>
            </div>
        </li>
    }
}

IdeasVoteActivity.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    activity: PropTypes.object.isRequired
};


registerTemplate({ name: 'ideas.votes', template: (data) => <IdeasVoteActivity activity={data} /> });