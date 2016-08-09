import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { TaskStates } from './taskstates.js'

let validations = {
    validateLaneName(name) {
        const count = TaskStates.find({ name }).count()
        if (count > 1) {
            throw new Meteor.Error('taskstate.name.alreadyExist', 'Lane with the specified name already exist')
        }
    }
};



const LANE_ID_ONLY = new SimpleSchema({
    laneId: { type: String },
}).validator()

export const insert = new ValidatedMethod({
    name: 'taskstates.insert',
    validate: new SimpleSchema({
        name: { type: String, optional: true },
        description: { type: String, optional: true }
    }).validator(),
    run({name, description, tasks = 0}) {
        if (!this.userId) { throw new Error('not-authorized'); }

        validations.validateLaneName(name)

        const ownerId = this.userId
        const createdAt = Date.now()

        return TaskStates.insert({ name, description, tasks, ownerId, createdAt })
    },
})

export const update = new ValidatedMethod({
    name: 'taskstates.update',
    validate: new SimpleSchema({
        laneId: { type: String, optional: true },
        name: { type: String, optional: true },
        description: { type: String, optional: true }
    }).validator(),
    run({laneId, name, description}) {

        const lane = TaskStates.findOne(laneId)

        if (!lane.editableBy(this.userId)) {
            throw new Meteor.Error('taskstates.update.accessDenied',
                "You don't have permission to edit this lane.")
        }

        if (lane.name !== data.name) {
            validations.validateLaneName(name)
        }
        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        TaskStates.update(laneId, {
            $set: { name, description }
        })
    },
})

export const remove = new ValidatedMethod({
    name: 'taskstates.remove',
    validate: LANE_ID_ONLY,
    run({ laneId }) {
        const idea = TaskStates.findOne(laneId)

        if (!idea.editableBy(this.userId)) {
            throw new Meteor.Error('taskstates.remove.accessDenied',
                "You don't have permission to remove this idea.")
        }

        TaskStates.remove(laneId)
    }
})

// Get list of all method names on ideas
const lanes_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name')

if (Meteor.isServer) {
    // Only allow 5 list operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(lanes_METHODS, name)
        },

        // Rate limit per connection ID
        connectionId() { return true; },
    }, 5, 1000)
}
