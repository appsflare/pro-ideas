/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Tasks } from '../tasks.js';

Meteor.publish('tasks.public', function (stateIds) {
    return Tasks.find({ state: { $in: stateIds } }, { fields: Tasks.publicFields, sort: { createdAt: -1 } })
})
Meteor.publish('tasks.public.findOne', function (taskId) {
    return Tasks.find({ _id: taskId }, { fields: Tasks.publicFields })
});
