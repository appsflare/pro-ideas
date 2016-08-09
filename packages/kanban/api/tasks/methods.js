import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Tasks } from './tasks.js'

let validations = {
    validateTaskTitle(title) {
        const count = Tasks.find({ title }).count()
        if (count > 1) {
            throw new Meteor.Error('task.name.alreadyExist', 'Task with the specified name already exist')
        }
    }
};


const TASK_ID_ONLY = new SimpleSchema({
    taskId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
    name: 'tasks.insert',
    validate: new SimpleSchema({
        title: { type: String },
        details: { type: String, optional: true }
    }).validator(),
    run({title, details, laneId}) {
        if (!this.userId) { throw new Error('not-authorized'); }

        validations.validateTaskTitle(title)

        const ownerId = this.userId
        const createdAt = Date.now()

        return Tasks.insert({ title, details, laneId, ownerId, createdAt })
    },
})

export const update = new ValidatedMethod({
    name: 'tasks.update',
    validate: new SimpleSchema({
        taskId: { type: String },
        laneId: { type: String },
        title: { type: String, optional: true },
        details: { type: String, optional: true }
    }).validator(),
    run({taskId, laneId, title, details}) {

        const task = Tasks.findOne(taskId)

        if (!task.editableBy(this.userId)) {
            throw new Meteor.Error('lanes.update.accessDenied',
                "You don't have permission to edit this lane.")
        }

        if(!title){
            title = task.title;
        }

        if(!details){
            details = task.details;
        }

        if(!laneId){
            laneId = task.laneId;
        }

        if (title && task.title !== title) {
            validations.validateTaskTitle(title)
        }
        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        Tasks.update(taskId, {
            $set: { title, details, laneId }
        })
    },
})

export const remove = new ValidatedMethod({
    name: 'lanes.remove',
    validate: TASK_ID_ONLY,
    run({ taskId }) {
        const idea = Tasks.findOne(taskId)

        if (!idea.editableBy(this.userId)) {
            throw new Meteor.Error('ideas.remove.accessDenied',
                "You don't have permission to remove this idea.")
        }

        Tasks.remove(taskId)
    }
})

// Get list of all method names on ideas
const tasks_METHODS = _.pluck([
    insert,
    update,
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
