import React, { Component, PropTypes } from 'react';
import CreateIdeaForm from '../components/create-idea-form';
import { Ideas } from '../../api/ideas/ideas';
import {IdeasList} from '../components/ideas-list';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Message from '../components/Message.jsx';

export class IdeasPage extends Component {



  get currentUser() {
    return Meteor.userId();
  }

  renderIdeasList(ideas) {
    return ideas.length ?
      <IdeasList ideas={this.props.ideas}/> :
      (<Message title="No ideas yet!!" subtitle="That's hard to hear!!!"/>);
  }

  render() {
    const {ideas} = this.props;
    return (
      <div className="container">      
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">Have an idea flashing in your head?</h3> </div>
          <div className="panel-body">
            {this.currentUser ? <CreateIdeaForm/> : 'Please login to start posting ideas!!!'}
          </div>
        </div>
        {this.renderIdeasList(ideas) }
      </div>
    );
  }
}

IdeasPage.propTypes = {
  ideas: PropTypes.array.isRequired
};