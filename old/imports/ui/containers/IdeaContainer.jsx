import { Meteor } from 'meteor/meteor';
import { Ideas } from '../../api/ideas/ideas';
import { createContainer } from 'meteor/react-meteor-data';
import {IdeaPage} from '../pages/IdeaPage.jsx';

export default createContainer(({ params: { id } }) => {
  const ideaHandle = Meteor.subscribe('ideas.public.findOne', id);
  const teamHandle = Meteor.subscribe('teams.public.findOne', id);  
  let loading = !ideaHandle.ready() && !teamHandle.ready();  
  const idea = Ideas.find({_id: id}, { sort: { createdAt: -1 } }).fetch()[0];
  const ideasExists = !loading && !!idea;
  
  return {
    loading,
    idea,
    team: ideasExists && idea.getTeam().fetch()[0],
    ideasExists    
  };
}, IdeaPage);
