import React, { Component, PropTypes } from 'react';
import { Card, CardTitle } from 'react-materialize';
import CreateIdeaForm from '../components/CreateIdeaForm';
import { Ideas } from '../../api/ideas/ideas';
import {IdeasList} from '../components/IdeasList';
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
        <Card title="Have an idea flashing in your head?">
            {this.currentUser ? <CreateIdeaForm/> : 'Please login to start posting ideas!!!'}
        </Card>
        {this.renderIdeasList(ideas) }
      </div>
    );
  }
}

IdeasPage.propTypes = {
  ideas: PropTypes.array.isRequired
};