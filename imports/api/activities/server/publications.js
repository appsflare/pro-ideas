/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Activities } from '../activities';

Meteor.publish('activities.public', function (ownerId) {
  return Activities.find({ $or: [{ ownerId }, { targetOwnerId: ownerId }, { itemOwnerId: ownerId }] }, { fields: Activities.publicFields, sort: { createdAt: -1 } });
});
