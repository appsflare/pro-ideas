import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import { VoteIdea } from './VoteIdea.jsx'
import { MarkIdeaAsCompleted } from './MarkIdeaAsCompleted.jsx'
import { remove } from '../../api/ideas/methods'
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
    return (<VoteIdea idea={idea} />);
  }


  render() {
    const idea = this.props.idea;
    return (
      <div className="post">
          <div className="user-block">
            <img className="img-circle img-bordered-sm" src="https://www.gravatar.com/avatar/00000000000000000000000000000000" alt="user image" />
            <span className="username">
            <Link to={`/idea/${idea._id}`}>{idea.name}</Link>
              {/*<a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a>*/}
            </span>
            <span className="description">Shared by {idea.ownerName}</span>
          </div>
          {/* /.user-block */}
          <p dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue)} />
          <ul className="list-inline">            
            <li>{this.renderVoteControls(idea)}
            </li>
            <li className="pull-right">
              <a href={`/idea/${idea._id}`} className="link-black text-sm"><i className="fa fa-comments-o margin-r-5" /> Comments ({idea.comments})</a></li>
          </ul>          
        </div>       

      
    );
  }
}

Idea.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  idea: PropTypes.object.isRequired
};
