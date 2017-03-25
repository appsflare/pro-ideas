import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


class ProfilesCollection extends Mongo.Collection {
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Profiles = new ProfilesCollection('profiles');

// Deny all client-side updates since we will be using methods to manage this collection
Profiles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Profiles.schema = new SimpleSchema({
  userName: {
    type: String,
    defaultValue: ''
  },
  education: {
    type: String,
    optional: true,
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
  profileImage: {
    type: String,
    optional: true,
    defaultValue: 'https://www.gravatar.com/avatar/00000000000000000000000000000000'
  }
});

Profiles.attachSchema(Profiles.schema);

Profiles.publicFields = {
  userName: 1,
  education: 1,
  location: 1,
  ownerId: 1,
  profileImage: 1
};


Profiles.helpers({

  editableBy(userId) {
    if (!this.ownerId) {
      return true;
    }

    return this.ownerId === userId
  }
});
