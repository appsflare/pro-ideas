import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { getFollowersCount, getFollowingCount } from './methods';
import { Profiles } from '../profiles/profiles.js';

const followersCountDenormalizer = {
  _updateProfile(ownerId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const comments = Profiles.findOne({ ownerId });

    const followersCount = getFollowersCount({ uid: ownerId })
    Profiles.update(ownerId, { $set: { followersCount } });
  },
  updateFollowersCount(profile) {
    this._updateProfile(profile.ownerId);
  }
};

export default followersCountDenormalizer;
