import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Tasks } from './tasks.js'
import { TaskStates } from '../taskstates/taskstates.js'

let validations = {
    validateTaskTitle(title) {
        // const count = title && title.length
        // if (count > 1) {
        //     throw new Meteor.Error('task.name.alreadyExist', 'Task with the specified name already exist')
        // }
    }
};


const TASK_ID_ONLY = new SimpleSchema({
    taskId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
    name: 'tasks.insert',
    validate: new SimpleSchema({
        title: { type: String },
        details: { type: String, optional: true },
        state: { type: String }
    }).validator(),
    run({title, details, state}) {
        if (!this.userId) { throw new Error('not-authorized'); }

        validations.validateTaskTitle(title)

        const createdBy = this.userId
        const createdAt = Date.now()

        return Tasks.insert({ title, details, state, createdAt, createdBy })
    },
})

export const updateTitle = new ValidatedMethod({
    name: 'tasks.update',
    validate: new SimpleSchema({
        taskId: { type: String },
        title: { type: String, optional: true }
    }).validator(),
    run({taskId, title, details}) {

        const task = Tasks.findOne(taskId)

        if (!task.editableBy(this.userId)) {
            throw new Meteor.Error('lanes.update.accessDenied',
                "You don't have permission to edit this lane.")
        }

        if (title && task.title !== title) {
            validations.validateTaskTitle(title)
        }
        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        Tasks.update(taskId, {
            $set: { title }
        })
    },
})

export const updateState = new ValidatedMethod({
    name: 'tasks.updateState',
    validate: new SimpleSchema({
        taskId: { type: String },
        stateId: { type: String }
    }).validator(),
    run({taskId, stateId}) {

        const task = Tasks.findOne(taskId)

        if (!task.editableBy(this.userId)) {
            throw new Meteor.Error('tasks.update.accessDenied',
                "You don't have permission to edit this task.")
        }

        const taskState = TaskStates.findOne(stateId)

        if (!taskState || (!taskState.editableBy(this.userId))) {
            throw new Meteor.Error('tasks.updateState.invalidState', 'invalid state')
        } 
        
        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        Tasks.update(taskId, {
            $set: { state: stateId }
        })
    },
})

export const remove = new ValidatedMethod({
    name: 'lanes.remove',
    validate: TASK_ID_ONLY,
    run({ taskId }) {
        const task = Tasks.findOne(taskId)

        if (!task.editableBy(this.userId)) {
            throw new Meteor.Error('ideas.remove.accessDenied',
                "You don't have permission to remove this idea.")
        }

        Tasks.remove(taskId)
    }
})

// Get list of all method names on ideas
const tasks_METHODS = _.pluck([
    insert,
    updateTitle,
    remove
], 'name')

if (Meteor.isServer) {
    // Only allow 5 list operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(tasks_METHODS, name)
        },

        // Rate limit per connection ID
        connectionId() { return true; },
    }, 5, 1000)
}
