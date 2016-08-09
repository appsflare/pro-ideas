import {KanbanApp} from 'meteor/pro-ideas:kanban';
import React, {Component} from 'react';

export default class TasksPage extends Component {


  constructor() {
    super(...arguments)   
  }

  get currentUser() {
    return Meteor.userId();
  }


  render() {
    return (
      <div className="container">
        <KanbanApp/>
      </div>
    );
  }
}