import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Idea from './idea';

export class IdeasList extends Component {

  renderIdeas() {
    return this.props.ideas.map((idea) => (
      <li key={idea._id} className="list-group-item">
        <Idea key={idea._id} idea={idea} />
      </li>
    ));
  }

  render() {
    return (
      <ul className="list-group">
        {this.renderIdeas() }
      </ul>
    );
  }
}

IdeasList.propTypes = {
  ideas: PropTypes.array.isRequired,
};

