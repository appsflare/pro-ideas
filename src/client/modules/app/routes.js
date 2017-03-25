import React from 'react';
import { mount } from 'react-mounter';
import { Accounts } from 'meteor/accounts-base';

import {
  AuthCheck,
  LayoutDefault,
  NotFound,
  LayoutSignup,
  LayoutSignIn
} from '/client/configs/components.js';

import Register from './components/Account/SignupWrapper.jsx';
import Login from './components/Account/LoginWrapper.jsx';
// import Password from './components/AccountPassword/Wrapper.jsx';
// import Profile from './components/AccountProfile/Wrapper.jsx';
// import Account from './components/AccountAccount/Wrapper.jsx';

export default function (injectDeps, { FlowRouter }) {

  const AuthCheckCtx = injectDeps(AuthCheck);

  // FlowRouter.route('/', {
  //   name: 'app.home',
  //   action() {
  //     mount(AuthCheckCtx, {
  //       LayoutDefault, content: () => (<Simplest title="App main screen"/>)
  //     });
  //   }
  // });

  FlowRouter.notFound = {
    action() {
      mount(AuthCheckCtx, {
        Layout: LayoutDefault, content: () => (<NotFound />)
      });
    }
  };

  FlowRouter.route('/register', {
    name: 'app.register',
    action() {
      mount(AuthCheckCtx, {
        Layout: LayoutSignup, content: () => (<Register />),
        requireNotLoggedIn: true
      });
    }
  });

  FlowRouter.route('/login', {
    name: 'app.login',
    action() {
      mount(AuthCheckCtx, {
        Layout: LayoutSignIn, content: () => (<Login />),
        requireNotLoggedIn: true
      });
    }
  });

  // FlowRouter.route('/logout', {
  //   name: 'app.logout',
  //   action() {
  //     Accounts.logout();
  //     // Meteor.logout(() => {
  //     FlowRouter.go('/login');
  //     // });
  //   }
  // });

  // FlowRouter.route('/password', {
  //   name: 'app.password',
  //   action() {
  //     mount(AuthCheckCtx, {
  //       LayoutDefault, content: () => (<Password />)
  //     });
  //   }
  // });

  // FlowRouter.route('/account', {
  //   name: 'app.account',
  //   action() {
  //     mount(AuthCheckCtx, {
  //       LayoutDefault, content: () => (<Account />),
  //       requireUserId: true
  //     });
  //   }
  // });

  // FlowRouter.route('/profile', {
  //   name: 'app.profile',
  //   action() {
  //     mount(AuthCheckCtx, {
  //       LayoutDefault, content: () => (<Profile />),
  //       requireUserId: true
  //     });
  //   }
  // });

}
