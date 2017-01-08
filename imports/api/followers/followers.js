import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

import followersCountDenormalizer from './followersCountDenormalizer';

function runDenormalizations(selector) {
  console.log('updating followers count!!', selector);
  var entry = Followers.findOne(selector);
  if (!entry) { return; }
  followersCountDenormalizer.updateFollowersCount(entry.follower);
  followersCountDenormalizer.updateFollowersCount(entry.followee);
}

class FollowersCollection extends Mongo.Collection {
  insert(follower, callback) {
    const result = super.insert(follower, callback);
    runDenormalizations({ _id: result });
    return result;
  }
  update(selector) {
    const result = super.update(...arguments);
    runDenormalizations(selector);
    return result;
  }
  remove(selector, callback) {
    const entries = super.find(selector).fetch();
    const result = super.remove(selector, callback);

    entries.forEach(entry => {
      followersCountDenormalizer.updateFollowersCount(entry.follower);
      followersCountDenormalizer.updateFollowersCount(entry.followee);
    });

    return result;
  }
}

export const Followers = new FollowersCollection('followers');

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

Factory.define('Follower', Followers, {})