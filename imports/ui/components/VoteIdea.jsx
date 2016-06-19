import React, { Component, PropTypes } from 'react';
import {cast} from '../../api/votes/methods'

export class VoteIdea extends Component {
    castVote(isUpVote) {
        this.currentUser && cast.call( {ideaId:this.props.idea._id, isUpVote}, err=>{
            
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
        return (<span> <button type="button" className={'btn btn-default' + (this.currentUser ? '' : 'disabled') } aria-label="Left Align" onClick={this.castVote.bind(this, true) }>
            <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true">{idea.upVotes ? ' ' + idea.upVotes : ''}</span>
        </button>

            <button type="button" className={'btn btn-default' + (this.currentUser ? '' : 'disabled') } aria-label="Left Align" onClick={this.castVote.bind(this, false) }>
                <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true">{idea.downVotes ? ' ' + idea.downVotes : ''}</span>
            </button>
        </span>);
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