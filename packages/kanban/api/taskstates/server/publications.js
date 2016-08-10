/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { TaskStates } from '../taskstates.js';

Meteor.publish('taskstates.public', function (boardId) {
    return TaskStates.find({ boardId }, { fields: TaskStates.publicFields, sort: { order: 1 } })
})
Meteor.publish('taskstates.public.findOne', function (id) {
    return TaskStates.find({ _id: id }, { fields: TaskStates.publicFields })
});
