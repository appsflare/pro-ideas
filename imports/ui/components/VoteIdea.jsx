import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import {cast} from '../../api/votes/methods'

export class VoteIdea extends Component {
    castVote(isUpVote) {
        this.currentUser && cast.call({ ideaId: this.props.idea._id, isUpVote }, err => {

        });
    }

    upVote() {
        this.castVote(true);
    }

    downVote() {
        this.castVote(false);
    }

    get currentUser() {
        return Meteor.userId();
    }


    _renderVoteControls(idea) {
        return (<span>
            <Button bsSize="xs" className={(this.currentUser ? '' : 'disabled') } onClick={this.castVote.bind(this, true) }>
                <i className="material-icons">thumb_up</i><span>{idea.upVotes ? ' ' + idea.upVotes : ''}</span>
            </Button>

            <Button bsSize="xs" className={(this.currentUser ? '' : 'disabled') } onClick={this.castVote.bind(this, false) }>
                <i className="material-icons">thumb_down</i><span>{idea.downVotes ? ' ' + idea.downVotes : ''}</span>
            </Button>
        </span>
        );
    }

    render() {
        const {idea} = this.props;

        return this._renderVoteControls(idea);
    }
}


VoteIdea.propTypes = {
    // This component gets the idea to display through a React prop.
    // We can use propTypes to indicate it is required
    idea: PropTypes.object.isRequired
};