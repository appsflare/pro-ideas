import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Followers = new Mongo.Collection('followers');

// Deny all client-side updates since we will be using methods to manage this collection
Followers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Followers.schema = new SimpleSchema({
  followee: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  follower: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
});

Followers.attachSchema(Followers.schema);

Followers.publicFields = {
  followee: 0,
  follower: 0
};