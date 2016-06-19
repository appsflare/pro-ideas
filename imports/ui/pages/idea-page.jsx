import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Ideas } from '../../api/ideas/ideas';
import { IdeaComments } from '../../api/idea-comments/idea-comments';
import IdeaCommentsListContainer from '../containers/idea-comments-list-container.jsx';
import {IdeaCommentForm} from '../components/idea-comment-form.jsx';
import {VoteIdea} from '../components/VoteIdea.jsx';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

export class IdeaPage extends Component {

  get currentUser() {
    return Meteor.userId();
  }

  castVote(isUpVote, idea) {
    idea && this.currentUser && Meteor.call('votes.cast', idea._id, isUpVote);
  }

  upVote() {
    this.castVote(true, idea);
  }

  downVote() {
    this.castVote(false, idea);
  }

  _renderVoteControls(idea) {
    return (<VoteIdea idea={idea}/>);
  }

  renderIdeaDetails(idea) {
    return (
      <div key={idea._id}>
        <div class="page-header">
          <h1>{idea.name} <small>by {idea.ownerName}</small></h1>
          {this._renderVoteControls(idea)}
        </div>

        <div className="bs-callout bs-callout-info">
          <h4>Business value</h4>
          <p>{idea.businessValue}</p>
        </div>

        {idea.definitionOfSuccess ?
          <div className="bs-callout bs-callout-info">
            <h4>Definition of Success</h4>
            <p>{idea.definitionOfSuccess}</p>
          </div>
          : ''}
        <div>
          { idea.requiredFund ? <h4>Funding Requirement  <span className="badge">{idea.comments}</span> </h4> : ''}
          <h4>Discussions  { idea.comments ? <span className="badge">{idea.comments}</span> : ''} </h4>
          <hr/>
         {this.currentUser? <IdeaCommentForm ideaId={idea._id} />:''}
          <IdeaCommentsListContainer ideaId={idea._id}/>
        </div>

      </div>
    );
  }

  renderIdea() {
    return this.props.ideas.map(idea => this.renderIdeaDetails(idea));
  }

  render() {
    return (
      <div className="container">
        {this.renderIdea() }
      </div>
    );
  }
}



IdeaPage.propTypes = {
  ideas: PropTypes.array.isRequired
};