/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Tasks } from '../tasks.js';

Meteor.publish('tasks.public', function () {
    return Tasks.find({}, { fields: Tasks.publicFields, sort: { createdAt: -1 } })
})
Meteor.publish('tasks.public.findOne', function (ideaId) {
    return Tasks.find({ _id: ideaId }, { fields: Tasks.publicFields })
});
