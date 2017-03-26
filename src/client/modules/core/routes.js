import React from 'react';
import { mount } from 'react-mounter';

import {
  AuthCheck,
  LayoutDefault  
} from '/client/configs/components';

import Home from './components/home';

// import Password from './components/AccountPassword/Wrapper.jsx';
// import Profile from './components/AccountProfile/Wrapper.jsx';
// import Account from './components/AccountAccount/Wrapper.jsx';

export default function (injectDeps, { FlowRouter }) {  

  const AuthCheckCtx = injectDeps(AuthCheck);

  FlowRouter.route('/', {
    name: 'app.home',
    action() {
      mount(AuthCheckCtx, {
        Layout: LayoutDefault,
        content: () => (<Home />)
      });
    }
  });



}
