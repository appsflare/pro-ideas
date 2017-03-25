import React from 'react';

import Component from './Component.jsx';
import {authComposer} from '/client/configs/composers.js';
const ComponentCtx = authComposer(Component);

import AuthLoading from '../AuthLoading/Wrapper.jsx';
import AuthDenied from '../AuthDenied/Wrapper.jsx';
import AccountLogin from '../Account/LoginWrapper.jsx';

export default class extends React.Component {

  render() {

    const {
      content,
      Layout,
      // LayoutComponent
    } = this.props;
    

    const displayLoading = () => (
      <Layout
        content={() => (<AuthLoading />)}
      />
    );

    const displayLogin = () => (
      <Layout
        content={() => (<AccountLogin />)}
      />
    );

    const displayDenied = () => (
      <Layout
        content={() => (<AuthDenied />)}
      />
    );

    const displayContent = () => (
      <Layout
        content={content}
      />
    );

    return (
      <ComponentCtx
        {...this.props}
        displayLoading={displayLoading}
        displayLogin={displayLogin}
        displayDenied={displayDenied}
        displayContent={displayContent}
      />
    );
  }
}
