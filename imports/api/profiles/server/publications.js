/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Profiles } from '../profiles';

Meteor.publish('profiles.public', function () {
  return Profiles.find({}, { fields: Profiles.publicFields, sort: { createdAt: -1 } })
})
Meteor.publish('profiles.public.findOne', function (ownerId) {
  return Profiles.find({ ownerId }, { fields: Profiles.publicFields })
});
