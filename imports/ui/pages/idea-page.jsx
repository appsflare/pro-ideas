import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Ideas } from '../../api/ideas';
import { IdeaComments } from '../../api/idea-comments';
import IdeaCommentsListContainer from '../containers/idea-comments-list-container';
import {IdeaCommentForm} from '../components/idea-comment-form';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

class IdeaPage extends Component {

  get currentUser() {
    return Meteor.userId();
  }

  renderIdeaDetails(idea) {
    return (
      <div key={idea._id}>
        <div class="page-header">
          <h1>{idea.name} <small>by {idea.ownerName}</small></h1>
        </div>

        <div className="bs-callout bs-callout-info"> 
          <h4>Business value</h4>
          <p>{idea.businessValue}</p> 
        </div>

        {idea.definitionOfSuccess?
        <div className="bs-callout bs-callout-info"> 
          <h4>Definition of Success</h4>
          <p>{idea.definitionOfSuccess}</p> 
        </div>
        :''}
        <div>
        { idea.requiredFund? <h4>Funding Requirement  <span className="badge">{idea.comments}</span> </h4>:''}
        <h4>Discussions  { idea.comments?<span className="badge">{idea.comments}</span>:''} </h4>
        <hr/>
          <IdeaCommentForm ideaId={idea._id} />
          <IdeaCommentsListContainer ideaId={idea._id}/>
        </div>

      </div>
    );
  }

  renderIdea() {
    return this.props.idea.map(idea => this.renderIdeaDetails(idea));
  }

  render() {
    return (
      <div>
        {this.renderIdea() }
      </div>
    );
  }
}



IdeaPage.propTypes = {
  idea: PropTypes.array.isRequired
};

export default createContainer(function (params) {
  let handle = Meteor.subscribe('ideas.public.findOne', params.ideaId);
  handle.ready();
  return {
    idea: Ideas.find().fetch()
  };
}, IdeaPage)
