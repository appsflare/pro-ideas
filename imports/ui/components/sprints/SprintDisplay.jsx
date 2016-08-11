import React, { Component, PropTypes } from 'react';
import {Panel} from 'react-bootstrap';
import {BubbleChart} from './BubbleChart.jsx'
import {EditTeamForm} from './EditTeamForm.jsx'
import {CreateTeamForm} from './CreateTeamForm.jsx'
import { createContainer } from 'meteor/react-meteor-data';

export class TeamDisplayComponent extends Component {
    constructor() {
        super(...arguments)
    }

    get currentUser() {
        return Meteor.userId();
    }


    renderTeamInfo(team) {
        return <EditTeamForm team={team}/>
    }



    renderContent(idea, team) {

        const isCurrentUserTheOwner = this.currentUser === idea.ownerId;

        return team ? this.renderTeamInfo(team) :
            (isCurrentUserTheOwner ? <CreateTeamForm ideaId={idea._id}/>
                : <p>Team has not been formed yet!!</p>)
    }

    render() {
        const {loading, idea, team} = this.props;
        return <Panel header="Team Info" bsStyle="primary">
            {loading ? <p>Checking...</p> : this.renderContent(idea, team) }
        </Panel>

    }
}


TeamDisplayComponent.PropTypes = {
    loading: PropTypes.bool,
    idea: PropTypes.object.isRequired,
    team: PropTypes.object
}

export const TeamDisplay = createContainer(({idea}) => {
    const teamsHandler = Meteor.subscribe('teams.public.findOne', idea._id)
    const loading = !(teamsHandler.ready());
    const team = loading ? null : idea.getTeam().fetch()[0];
    return {
        loading: loading,
        team: team,
        idea: idea
    }
}, TeamDisplayComponent);