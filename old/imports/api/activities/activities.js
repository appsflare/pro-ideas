import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';


class ActivitiesCollection extends Mongo.Collection {
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Activities = new ActivitiesCollection('activities');

// Deny all client-side updates since we will be using methods to manage this collection
Activities.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Activities.schema = new SimpleSchema({
  body: {
    type: String,
    defaultValue: ''
  },
  type: {
    type: String,
    defaultValue: ''
  },
  itemId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  itemOwnerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  itemDetails: {
    type: Object,
    optional: true,
    blackbox: true
  },
  targetOwnerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    denyUpdate: true
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  ownerName: {
    type: String,
    denyUpdate: true,
  },
  createdAt: {
    type: Date
  }
});

Activities.attachSchema(Activities.schema);

Activities.publicFields = {  
  body: 1,
  type: 1,
  ownerId: 1,
  ownerName: 1,
  itemId: 1,
  itemOwnerId: 1,
  itemDetails: 1,
  createdAt: 1
};

Factory.define('Actiivity', Activities, {})