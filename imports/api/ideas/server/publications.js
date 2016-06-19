/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Ideas } from '../ideas.js';

 Meteor.publish('ideas.public', function () {
    return Ideas.find({}, { fields: Ideas.publicFields, sort: { createdAt: -1 } })
  })
  Meteor.publish('ideas.public.findOne', function (ideaId) {
    return Ideas.find({_id: ideaId}, { fields: Ideas.publicFields})
  });
