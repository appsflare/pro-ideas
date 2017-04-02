import { Meteor } from 'meteor/meteor';
import { Images } from '/lib/collections/images';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const removeFile = new ValidatedMethod({
    name: 'images.remove',
    validate: new SimpleSchema({
        imageId: { type: String }
    }).validator(),
    run({ imageId }) {

        const userId = Meteor.user()._id;
        if (!userId) { throw new Error('not-authorized'); }

        Images.remove({ _id: imageId, userId });
    }
});