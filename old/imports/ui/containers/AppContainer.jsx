import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { Ideas } from '../../api/ideas/ideas';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const publicHandle = Meteor.subscribe('ideas.public');  
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    ideas: Ideas.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);
