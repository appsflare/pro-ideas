import React, { Component, PropTypes } from 'react';

import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from './ui/containers/app-container';
import createContainer from './ui/containers/ideas-container';
import {Register} from './ui/pages/register';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="ideas" component={createContainer}/>
      <Route path="register" component={Register}/>      
    </Route>
  </Router>
);