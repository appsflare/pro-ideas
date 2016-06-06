import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Idea from './Idea.jsx';

export class IdeasList extends Component {

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    let nameInput = ReactDOM.findDOMNode(this.refs.nameInput);
    let descInput = ReactDOM.findDOMNode(this.refs.descInput);

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    Meteor.call('ideas.insert', name, description);

    // Clear form
    nameInput.value = '';
    descInput.value = '';
  }

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

