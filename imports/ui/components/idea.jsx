import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {VoteIdea} from './VoteIdea.jsx'
import {remove} from '../../api/ideas/methods'
import textUtils from '../helpers/text'

// Task component - represents a single todo item
export default class Idea extends Component {

  deleteThisIdea() {
    this.currentUser && remove.call({ ideaId: this.props.idea._id }, err => {
      err && console.error(err);
    });
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

          <Link to={`/idea/${idea._id}`}>
            {idea.name}<small> by {idea.ownerName} </small>
          </Link>

        </h4>
        <p class="list-group-item-text" dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue)}/>

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
