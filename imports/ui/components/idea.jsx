import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import {VoteIdea} from './VoteIdea.jsx'
import {MarkIdeaAsCompleted} from './MarkIdeaAsCompleted.jsx'
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
            <i className="material-icons">{idea.isCompleted()?'done':'hourglass_empty'}</i> {idea.name}<small> by {idea.ownerName} </small>
          </Link>

        </h4>
        <p className="list-group-item-text" dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue) }/>

        <ButtonGroup className="btn-group-raised">
          {idea.ownerId === this.currentUser ?
            <Button bsSize="xs" onClick={this.deleteThisIdea.bind(this) }>
              <i className="material-icons">delete</i>
            </Button>
            : ''
          }

          {this.renderVoteControls(idea) }          
        </ButtonGroup>
        {<MarkIdeaAsCompleted className="pull-right" idea={idea}/>}

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
