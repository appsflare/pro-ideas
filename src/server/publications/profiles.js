/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Profiles } from '/lib/collections/profiles';

export default function () {

  Meteor.publish('profiles.public', function () {
    return Profiles.find({}, { fields: Profiles.publicFields, sort: { createdAt: -1 } })
  });
  Meteor.publish('profiles.users.public', function () {
    return Meteor.users.find({}, { fields: { profile: 1, emails: 1 } })
  });
  Meteor.publish('profiles.public.findOne', function (ownerId) {
    return Profiles.find({ ownerId }, { fields: Profiles.publicFields })
  });

};