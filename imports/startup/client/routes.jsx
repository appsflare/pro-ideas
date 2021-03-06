import React from 'react';
import { Router, Route, browserHistory } from 'react-router';


// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import AppAuthContainer from '../../ui/containers/AppAuthContainer.jsx';
import IdeasContainer from '../../ui/containers/IdeasContainer.jsx';
import IdeaContainer from '../../ui/containers/IdeaContainer.jsx';
import ProfileContainer from '../../ui/containers/ProfileContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import ChangePasswordPage from '../../ui/pages/ChangePasswordPage.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';
import KanbanPageContainer from '../../ui/containers/KanbanPageConainer.jsx';

export const renderRoutes = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/auth" component={AppAuthContainer}>
        <Route path="signin" component={AuthPageSignIn} />
        <Route path="join" component={AuthPageJoin} />
      </Route>
      <Route path="/" component={AppContainer}>
        <Route path="ideas" component={IdeasContainer} params={{ all: true }} />
        <Route path="my-ideas" component={IdeasContainer} params={{ all: false }} />
        <Route path="profile/:ownerId" component={ProfileContainer} params={{ all: false }} />
        <Route name="idea" path="idea/:id" component={IdeaContainer} />

        <Route path="change-password" component={ChangePasswordPage} />
        <Route path="idea/:ideaId/tasks" component={KanbanPageContainer} />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  );
};
