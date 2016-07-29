import './IdeasList.scss';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Idea from './idea';

export class IdeasList extends Component {

  renderIdeas() {
    return this.props.ideas.map((idea) => (
      <div key={idea._id} className="collection-item">
        <Idea key={idea._id} idea={idea} />
      </div>
    ));
  }

  render() {
    return (
      <div className="ideas-list collection">
        {this.renderIdeas() }
      </div>
    );
  }
}

IdeasList.propTypes = {
  ideas: PropTypes.array.isRequired,
};

