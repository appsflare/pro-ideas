import { Meteor } from 'meteor/meteor';
import { render, ReactDOM } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';


Meteor.startup(() => {  
  window && (window.ReactDOM = ReactDOM);
  render(renderRoutes(), document.getElementById('app'));
});