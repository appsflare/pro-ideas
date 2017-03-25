import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Activities } from '/lib/collections/activities';

export function add({ body, type, itemId, itemOwnerId, itemDetails }) {

  const userId = Meteor.user()._id;
  if (!userId) { throw new Error('not-authorized'); }

  return Activities.insert({
    body,
    type,
    itemId,
    itemOwnerId,
    itemDetails,
    ownerId: userId,
    createdAt: new Date
  });
}