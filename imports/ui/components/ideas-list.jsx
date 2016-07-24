import './ideas-list.less';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Idea from './idea';

export class IdeasList extends Component {

  renderIdeas() {
    return this.props.ideas.map((idea) => (
      <div key={idea._id}>
        <div className="list-group-item">
          <div className="row-action-primary">
            <i className="material-icons">{idea.isCompleted()?'done':'hourglass_empty'}</i>
          </div>
          <div className="row-content">
            <Idea key={idea._id} idea={idea} />
          </div>
        </div>
        <div className="list-group-separator"></div>
      </div>
    ));
  }

  render() {
    return (
      <div className="ideas-list list-group">
        {this.renderIdeas() }
      </div>
    );
  }
}

IdeasList.propTypes = {
  ideas: PropTypes.array.isRequired,
};

