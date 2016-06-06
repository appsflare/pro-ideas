import {IdeasList} from '../components/ideas-list';
import { createContainer } from 'meteor/react-meteor-data';
import { Ideas } from '../../api/ideas.js';

export default createContainer(() => {
  return {
    ideas: Ideas.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, IdeasList);