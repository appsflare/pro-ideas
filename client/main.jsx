import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config';
import {renderRoutes} from '../imports/routes';

renderRoutes();

Meteor.startup(() => {  
  // render(renderRoutes(), document.getElementById('render-target'));
  
});
