import { Meteor } from 'meteor/meteor'
import { Ideas } from '../../api/ideas/ideas'
import { createContainer } from 'meteor/react-meteor-data'
import { KanbanPage } from '../pages/KanbanPage.jsx'

export default createContainer(({ params: { ideaId } }) => {
    const ideaHandle = Meteor.subscribe('ideas.public.findOne', ideaId);
    const teamHandle = Meteor.subscribe('teams.public.findOne', ideaId);
    let loading = !ideaHandle.ready() && !teamHandle.ready();
    const idea = Ideas.find({ _id: ideaId }, { sort: { createdAt: -1 } }).fetch()[0];
    const ideasExists = !loading && !!idea;

    return {
        loading,
        idea,
        team: ideasExists && idea.getTeam().fetch()[0],
        ideasExists
    };
}, KanbanPage);
