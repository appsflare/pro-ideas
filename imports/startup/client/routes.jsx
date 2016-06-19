import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import IdeasContainer from '../../ui/containers/IdeasContainer.jsx';
import IdeaContainer from '../../ui/containers/IdeaContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="ideas" component={IdeasContainer} params={{ all: true }}/>
      <Route path="my-ideas" component={IdeasContainer} params={{ all: false }}/>
      <Route name="idea" path="idea/:id" component={IdeaContainer}/>
      <Route path="signin" component={AuthPageSignIn}/>
      <Route path="join" component={AuthPageJoin}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);
