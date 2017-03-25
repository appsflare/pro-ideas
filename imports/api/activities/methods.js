import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Activities } from './activities';

export function add({ body, type, itemId, itemOwnerId, itemDetails}) {  
  
  const userId = Meteor.user()._id;  
  if (!userId) { throw new Error('not-authorized'); } 

  return Activities.insert({
    body,
    type,
    itemId,
    itemOwnerId,
    itemDetails,
    ownerId: userId,
    ownerName: Meteor.user().profile.fullName,
    createdAt: new Date
  });
}