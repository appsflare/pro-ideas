import React, { Component, PropTypes } from 'react';
import { registerTemplate } from './templateStore';

class IdeasCommentCreateActivity extends Component {

    constructor() {
        super(...arguments);
    }
    get currentUser() {
        return Meteor.userId();
    }

    render() {
        const {_id, ownerId, ownerName, itemId, itemOwnerId, itemDetails, body, createdAt} = this.props.activity;


        const currentUserCommenter = ownerId == this.currentUser;

        return <li key={_id}>
            <i className="fa fa-comments bg-yellow" />
            <div className="timeline-item">
                <span className="time"><i className="fa fa-clock-o" /> {moment(createdAt).fromNow()}</span>
                <h3 className="timeline-header"><a href={`/profile/${ownerId}`}>{currentUserCommenter ? 'You' : ownerName}</a> commented on
                <a href={`/idea/${itemDetails.ideaId}`}> idea</a>
                </h3>
                <div className="timeline-body">{body}</div>
                <div className="timeline-footer">
                    <a className="btn btn-warning btn-flat btn-xs">View idea</a>
                </div>
            </div></li>
    }
}

IdeasCommentCreateActivity.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    activity: PropTypes.object.isRequired
};


registerTemplate({ name: 'ideas.comments.create', template: (data) => <IdeasCommentCreateActivity activity={data} /> });