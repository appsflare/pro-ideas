import { KanbanApp } from 'meteor/pro-ideas:kanban';
import React, {Component, PropTypes} from 'react';

export class KanbanPage extends Component {

  constructor() {
    super(...arguments)
  }

  get currentUser() {
    return Meteor.userId();
  }


  render() {
    const { idea } = this.props;
    return (<div className="container-fluid">
      <h1>Manage Tasks for {idea.name}</h1>
      <KanbanApp boardId={idea.kanbanBoardId}/>
    </div>
    );
  }
}

KanbanPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  idea: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired
};