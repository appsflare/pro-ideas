import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';


class ProfilesCollection extends Mongo.Collection {
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Profiles = new ProfilesCollection('Ideas');

// Deny all client-side updates since we will be using methods to manage this collection
Profiles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Profiles.schema = new SimpleSchema({
  userName: {
    type: String,
    defaultValue: ''
  },
  education: {
    type: String,
    defaultValue: ''
  },
  location: {
    type: String,
    optional: true,
    defaultValue: ''
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },

  ideasCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  followersCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  followingCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
});

Profiles.attachSchema(Profiles.schema);

Profiles.publicFields = {
  userName: 1,
  education: 1,
  location: 1,
  ownerId: 1,
  ideasCount: 1,
  followersCount: 1,
  followingCount: 1,
  followers: 0,
  following: 0
};

Factory.define('Profile', Profiles, {})

Profiles.helpers({
  // A Idea is considered to be private if it has a userId set

  getFollowers() {
    return Profiles.find({ _id: { $in: this.followers }, fields: Profile.publicFields })
  },

  getFollowingUsers() {
    return Profiles.find({ _id: { $in: this.following }, fields: Profile.publicFields })
  },

  editableBy(userId) {
    if (!this.ownerId) {
      return true
    }

    return this.ownerId === userId
  }
})
