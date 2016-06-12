import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CreateIdeaForm from '../components/create-idea-form';
import { Ideas } from '../../api/ideas.js';
import {IdeasList} from '../components/ideas-list';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

class IdeasPage extends Component {



  get currentUser() {
    return Meteor.userId();
  }

  renderIdeasList() {
    return <IdeasList ideas={this.props.ideas} />
  }

  render() {
    return (
      <div>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">Have an idea flashing in your head?</h3> </div>
          <div className="panel-body">
            {this.currentUser ? <CreateIdeaForm/> : 'Please login to start posting ideas!!!'}
          </div>
        </div>
        {this.renderIdeasList() }
      </div>
    );
  }
}



IdeasPage.propTypes = {
  ideas: PropTypes.array.isRequired
};

export default createContainer(function (params) {
  let handle = Meteor.subscribe('ideas.public');
  handle.ready();
  return {
    ideas: Ideas.find({}, { sort: { createdAt: -1 } }).fetch()
  };
}, IdeasPage)
