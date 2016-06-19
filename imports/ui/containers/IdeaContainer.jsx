import { Meteor } from 'meteor/meteor';
import { Ideas } from '../../api/ideas/ideas';
import { createContainer } from 'meteor/react-meteor-data';
import {IdeaPage} from '../pages/idea-page.jsx';

export default createContainer(({ params: { id } }) => {
  const ideasHandle = Meteor.subscribe('ideas.public.findOne', id);
  const loading = !ideasHandle.ready();
  const ideas = Ideas.find({_id: id}, { sort: { createdAt: -1 } }).fetch();
  const ideasExists = !loading && !!ideas;
  return {
    loading,
    ideas,
    ideasExists    
  };
}, IdeaPage);
