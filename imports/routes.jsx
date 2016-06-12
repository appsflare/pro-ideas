import React, { Component, PropTypes } from 'react'
import {mount} from 'react-mounter';

// import { FlowRouter } from 'kadira:flow-router'

// route components
import { DefaultLayout } from './ui/shared/default-layout';
import IdeasPageContainer from './ui/pages/ideas-page';
import { Register } from './ui/pages/register';
import  IdeaPageCotnainer  from './ui/pages/idea-page';

export const renderRoutes = function () {

  FlowRouter.route('/', {
    action() {
      mount(DefaultLayout, { content: <IdeasPageContainer/> })
    }
  })

  FlowRouter.route('/ideas', {
    action() {
      mount(DefaultLayout, { content: <IdeasPageContainer/> })
    }
  })

  FlowRouter.route('/idea/:id', {
    action(params) {
      mount(DefaultLayout, { content: <IdeaPageCotnainer ideaId={params.id}/> })
    }
  })

  FlowRouter.route('/register', {
    action() {
      mount(DefaultLayout, { content: <Register /> })
    }
  })

}