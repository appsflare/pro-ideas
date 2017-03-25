/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Ideas } from '/lib/collections/ideas';

export default function () {

  Meteor.publishComposite('ideas.public', function (limit = 10, skip = 0) {
    return {
      find() {
        Ideas.find({}, {
          fields: Ideas.publicFields,
          sort: { createdAt: -1 },
          limit,
          skip
        })
      },
      children: [
        {
          find(idea) {
            return Meteor.users.find({ _id: idea.ownerId }, { limit: 1 });
          }
        }
      ]
    };
  });

  Meteor.publishComposite('ideas.findOne', function () {
    return {
      find() {
        Ideas.find({}, {
          fields: Ideas.publicFields,
          sort: { createdAt: -1 },
          limit: 1
        })
      },
      children: [
        {
          find(idea) {
            return Meteor.users.find({ _id: idea.ownerId }, { limit: 1 });
          }
        }
      ]
    };
  });

};