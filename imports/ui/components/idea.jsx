import React, { Component, PropTypes } from 'react';
import { Button, Icon, Badge } from 'react-materialize';
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
        <h5>

          <Link to={`/idea/${idea._id}`}>
            <Icon>{idea.isCompleted() ? 'done' : 'hourglass_empty'}</Icon> {idea.name}<small> by {idea.ownerName} </small>
          </Link>

        </h5>
        <p dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue) }/>

        {idea.ownerId === this.currentUser ?
          <Button waves="light" onClick={this.deleteThisIdea.bind(this) }>
            <Icon>delete </Icon>
          </Button>
          : ''
        }

        {this.renderVoteControls(idea) }

        {<MarkIdeaAsCompleted className="right" idea={idea}/>}

        {idea.comments > 0 ?
          <Badge className="right" data-badge-caption=" Comments" newIcon>{idea.comments}</Badge>
          : ''}

      </div>
    );
  }
}

Idea.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  idea: PropTypes.object.isRequired
};
