import { Meteor } from 'meteor/meteor';
import { Images } from '/lib/collections/images';
import { Videos } from '/lib/collections/videos';

export default function () {

    Images.denyClient();
    Videos.denyClient();


    Meteor.publish('files.images.all', function () {
        return Images.find({ userId: this.userId }).cursor;
    });

    Meteor.publish('files.videos.all', function () {
        return Videos.find({ userId: this.userId }).cursor;
    });

    Meteor.publish('files.images.one', function (id) {
        return Images.find({ _id: id }).cursor;
    });

    Meteor.publish('files.videos.one', function (id) {
        return Videos.find({ _id: id }).cursor;
    });

    Meteor.publish('files.images.linked.public', function (linkedDocId) {
        return Images.find({ public: true, meta: { linkedDocId } }).cursor;
    });


    Meteor.publish('files.videos.linked.public', function (linkedDocId) {
        return Videos.find({ public: true, meta: { linkedDocId } }).cursor;
    });

    Meteor.publish('files.images.all.public', function () {
        return Images.find({ public: true }).cursor;
    });

    Meteor.publish('files.videos.all.public', function () {
        return Videos.find({ public: true }).cursor;
    });

}