import React, { Component, PropTypes } from 'react';
import {remove} from '../../api/idea-comments/methods';

// Task component - represents a single todo item
export default class IdeaComment extends Component {

  deleteThisComment() {
    remove.call( {commentId:this.props.comment._id}, err=>{
      err && console.error(err);
    });
  }

  get currentUser() {
    return Meteor.userId();
  }

  render() {
    const comment = this.props.comment;
    return (

      <div className="panel panel-default">
        <div className="panel-heading">
          {comment.ownerName} <small>commented {moment(comment.createdAt).fromNow() }</small>
          {comment.ownerId == this.currentUser ?
            <button type="button" className="close" aria-label="Close" onClick={this.deleteThisComment.bind(this) }>
              <span aria-hidden="true">&times; </span>
            </button>
            : ''
          }
        </div>
        <div className="panel-body">
          {comment.text}
        </div>
      </div>
    );
  }
}

IdeaComment.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  comment: PropTypes.object.isRequired
};
