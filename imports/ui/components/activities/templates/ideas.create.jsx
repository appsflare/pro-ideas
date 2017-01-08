import React, { Component, PropTypes } from 'react';
import { registerTemplate } from './templateStore';

class IdeasCreateActivity extends Component {

    constructor() {
        super(...arguments);
    }

    get currentUser() {
        return Meteor.userId();
    }

    render() {
        const {ownerId, ownerName, _id, itemId, body, createdAt} = this.props.activity;

        return <li key={_id}>
            <i className="fa fa-flash bg-blue"></i>
            <div className="timeline-item">
                <span className="time"><i className="fa fa-clock-o" /> {moment(createdAt).fromNow()}</span>
                <h3 className="timeline-header"><a href={`/profile/${ownerId}`}>{this.currentUser == ownerId ? 'You' : ownerName}</a> shared an idea</h3>
                <div className="timeline-body">{body}</div>
                <div className="timeline-footer">
                    <a className="btn btn-primary btn-xs">View idea</a>
                </div>
            </div>
        </li>
    }
}

IdeasCreateActivity.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    activity: PropTypes.object.isRequired
};


registerTemplate({ name: 'ideas.create', template: (data) => <IdeasCreateActivity activity={data} /> });