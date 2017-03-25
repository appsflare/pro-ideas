import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Followers } from './followers';
import { Profiles } from '../profiles/profiles.js';

function getFollowersCount(uid) {
  return Followers.find({
    followee: uid
  }).count();
}

function getFollowingCount(uid) {
  return Followers.find({
    follower: uid
  }).count();
}

const followersCountDenormalizer = {
  _updateProfile(ownerId) {    // Recalculate the correct incomplete count direct from MongoDB   

    const followersCount = getFollowersCount(ownerId);
    const followingCount = getFollowingCount(ownerId);
    Profiles.update({ ownerId }, { $set: { followersCount, followingCount } });
    console.log('update profile ', { ownerId }, ' with ', { followersCount, followingCount })
  },
  updateFollowersCount(ownerId) {
    this._updateProfile(ownerId);
  }
};

export default followersCountDenormalizer;
