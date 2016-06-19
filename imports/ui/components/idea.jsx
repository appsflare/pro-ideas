import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {VoteIdea} from './VoteIdea.jsx'

// Task component - represents a single todo item
export default class Idea extends Component {

  deleteThisIdea() {
   this.currentUser && Meteor.call('ideas.remove', this.props.idea._id);
  }

  castVote(isUpVote) {
    this.currentUser && Meteor.call('votes.cast', this.props.idea._id, isUpVote);
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

  renderVoteControls(idea) {    
    return (<VoteIdea idea={idea}/>);
  }


  render() {
    const idea = this.props.idea;    
    return (
      <div>
        <h4 className="list-group-item-heading">

        <Link to={`idea/${idea._id}`}>
          {idea.name}<small> by {idea.ownerName} </small>
        </Link>        
        
        </h4>
        <p class="list-group-item-text">{idea.description}</p>

        <a href="#" >

        </a>
        {idea.ownerId === this.currentUser ?
          <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.deleteThisIdea.bind(this) }>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
          : ''
        }

        {this.renderVoteControls(idea) }

        <span className="pull-right badge">{idea.comments}</span>

      </div>
    );
  }
}

Idea.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  idea: PropTypes.object.isRequired
};
