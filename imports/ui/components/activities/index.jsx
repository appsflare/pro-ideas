import React, { Component, PropTypes } from 'react';

import IdeaCreateActivity from './templates/ideas.create';
import IdeasCommentCreateActivity from './templates/ideas.comments.create';
import IdeasVoteActivity from './templates/ideas.votes';

import { renderItem } from './templates/templateStore';


export class ActivityTimeline extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        const { activityStreams } = this.props;
 /* The timeline */return <ul className="timeline timeline-inverse">
            {/* timeline time label */}

            {_.map(activityStreams, ({date, stream}) => {

                let items = [];
                items.push(<li key={date} className="time-label">
                    <span className="bg-red">{date}</span>
                </li>)

                return items.concat(stream.map(a => renderItem(a.type, a)))
            })}
        </ul>
    }
}


ActivityTimeline.propTypes = {
    activityStreams: PropTypes.array.isRequired
};



