import React, { Component, PropTypes } from 'react';
import { Ideas } from '../../api/ideas.js';

// Task component - represents a single todo item
export default class Idea extends Component {

  deleteThisIdea() {
    Meteor.call('ideas.remove', this.props.idea._id);
  }

  castVote(isUpVote) {
    Meteor.call('votes.cast', this.props.idea._id, isUpVote);
  }

  upVote() {
    this.castVote(true);
  }

  downVote() {
    this.castVote(false);
  }
  
  
  get currentUser(){
    return Meteor.userId();
  }

  render() {
    return (
      <div>
        <h4 className="list-group-item-heading">{this.props.idea.name}<small> by {this.props.idea.ownerName} </small></h4>
        <p class="list-group-item-text">{this.props.idea.description}</p>

        <a href="#" >

        </a>
        {this.props.idea.owner == this.currentUser ?
          <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.deleteThisIdea.bind(this) }>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
          : ''
        }


        <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.castVote.bind(this, true) }>
          <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true">{this.props.idea.upVotes ? ' ' + this.props.idea.upVotes : ''}</span>
        </button>

        <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.castVote.bind(this, false) }>
          <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true">{this.props.idea.downVotes ? ' ' + this.props.idea.downVotes : ''}</span>
        </button>

      </div>
    );
  }
}

Idea.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  idea: PropTypes.object.isRequired
};
