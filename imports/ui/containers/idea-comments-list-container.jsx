import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { IdeaComments } from '../../api/idea-comments/idea-comments.js';
import {IdeaCommentsList} from '../components/idea-comments-list';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

export default createContainer((params)=>{    
    let handle = Meteor.subscribe('idea-comments.public', params.ideaId);
    handle.ready();
    return {
        comments: IdeaComments.find().fetch()
    };
}, IdeaCommentsList);