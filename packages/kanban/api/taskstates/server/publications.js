/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { TaskStates } from '../taskstates.js';

Meteor.publish('taskstates.public', function () {
    return TaskStates.find({}, { fields: TaskStates.publicFields, sort: { createdAt: -1 } })
})
Meteor.publish('taskstates.public.findOne', function (ideaId) {
    return TaskStates.find({ _id: ideaId }, { fields: TaskStates.publicFields })
});
