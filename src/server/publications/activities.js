/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
//import { publishComposite } from 'meteor/reywood:publish-composite';

import { Activities } from '/lib/collections/activities';

export default function () {

  Meteor.publishComposite('activities.public', function (ownerId) {
    return {
      find() {
        return Activities.find({
          $or: [
            { ownerId },
            { targetOwnerId: ownerId },
            { itemOwnerId: ownerId }
          ]
        },
          {
            fields: Activities.publicFields,
            sort: { createdAt: -1 }
          });
      }
      , children: [
        {
          find(activity) {
            return Meteor.users.find({ _id: activity.ownerId }, { limit: 1 });
          }
        }
      ]
    }
  });
};