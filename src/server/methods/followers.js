import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';


import { Followers } from '/lib/collections/followers';

const USER_ID_ONLY = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
}).validator();

export const follow = new ValidatedMethod({
  name: 'followers.follow',
  validate: USER_ID_ONLY,
  run({uid}) {
    return Followers.update({
      followee: uid,
      follower: this.userId
    }, {
        $set: {
          invalidatedAt: undefined
        },
        $setOnInsert: {
          followee: uid,
          follower: this.userId,
          invalidatedAt: undefined
        }
      }, {
        upsert: true
      });
  }
});

export const unfollow = new ValidatedMethod({
  name: 'followers.unfollow',
  validate: USER_ID_ONLY,
  run({uid}) {
    check(uid, String);
    return Followers.remove({
      followee: uid,
      follower: this.userId
    });
  }
});

export const unfollowAll = new ValidatedMethod({
  name: 'followers.unfollowAll',
  validate: USER_ID_ONLY,
  run({uid}) {
    return Followers.remove({
      follower: this.userId
    });
  }
});

export const getFollowers = new ValidatedMethod({
  name: 'followers.getFollowers',
  validate: USER_ID_ONLY,
  run({uid}) {
    let followers = Followers.find({
      followee: uid
    }).fetch();
    return _.map(followers, function (value, index, list) {
      return value.follower;
    });
  }
});

export const getFollowersCount = new ValidatedMethod({
  name: 'followers.getFollowersCount',
  validate: USER_ID_ONLY,
  run({uid}) {
    return Followers.find({
      followee: uid
    }).count();
  }
});

export const getFollowing = new ValidatedMethod({
  name: 'followers.getFollowing',
  validate: USER_ID_ONLY,
  run({uid}) {
    check(uid, String);
    let following = Followers.find({
      follower: uid
    }).fetch();
    return _.map(following, function (value, index, list) {
      return value.followee;
    });
  }
});

export const getFollowingCount = new ValidatedMethod({
  name: 'followers.getFolloweringCount',
  validate: USER_ID_ONLY,
  run({uid}) {
    return Followers.find({
      follower: uid
    }).count();
  }
});

export const checkIfFollowing = new ValidatedMethod({
  name: 'followers.checkIfFollowing',
  validate: USER_ID_ONLY,
  run({uid}) {
    return !!Followers.findOne({
      followee: uid,
      follower: this.userId
    });
  }
});

if (Meteor.isServer) {

  export const deleteUserData = new ValidatedMethod({
    name: 'followers.deleteUserData',
    validate: USER_ID_ONLY,
    run({uid}) {
      return Followers.remove({
        $or: [
          { followee: uid },
          { follower: this.userId }
        ]
      });
    }
  });
}

// Get list of all method names on ideas
const followers_METHODS = _.pluck([

  follow,
  unfollow,
  unfollowAll,
  getFollowers,
  getFollowersCount,
  getFollowing,
  getFollowingCount,
  checkIfFollowing
], 'name');

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(followers_METHODS, name)
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000)
}
