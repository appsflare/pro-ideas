import './IdeaCommentsList.scss';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import IdeaComment from './IdeaComment.jsx';

export class IdeaCommentsList extends Component {

  renderComments() {
    return this.props.comments.map((comment) => (
      <div key={comment._id}>
        <IdeaComment key={comment._id} comment={comment} />
      </div>
    ));
  }

  render() {    
    return (
      <div className="direct-chat-messages">

        {this.props.comments.length? this.renderComments(): 'Start a discussion here!' }
      </div>
    );
  }
}

IdeaCommentsList.propTypes = {
  comments: PropTypes.array.isRequired,
};

