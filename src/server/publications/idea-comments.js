import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { IdeaComments } from '/lib/collections/idea-comments';

export default function () {

  Meteor.publishComposite('idea-comments.public', function (ideaId, limit = 10, skip = 0) {

    return {
      find() {
        return IdeaComments.find({ ideaId: ideaId }, { sort: { createdAt: -1 }, skip, limit });
      },
      children: [
        {
          find(ideaComment) {
            return Meteor.users.find({ _id: ideaComment.ownerId }, { limit: 1 });
          }
        }
      ]
    }
  });
};
