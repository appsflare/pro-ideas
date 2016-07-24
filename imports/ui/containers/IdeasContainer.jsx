import { Meteor } from 'meteor/meteor';
import { Ideas } from '../../api/ideas/ideas';
import { createContainer } from 'meteor/react-meteor-data';
import {IdeasPage} from '../pages/ideas-page';

export default createContainer(({ route: { params: { all } }}) => {
  const ideasHandle = Meteor.subscribe('ideas.public');
  const loading = !ideasHandle.ready();
  const ideas = Ideas.find(all ? {} : { ownerId: Meteor.userId() }, { sort: { upVotes: -1, createdAt: -1 } }).fetch();
  const ideasExists = !loading && !!ideas;
  return {
    loading,
    ideas,
    ideasExists
  };
}, IdeasPage);
