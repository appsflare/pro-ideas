import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import useGridFS from './gridfs';

export const Images = new FilesCollection(useGridFS({
    collectionName: 'images',
    allowClientCode: false,
    debug: Meteor.isServer && process.env.NODE_ENV === 'development',
    onBeforeUpload(file) {
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) return true;
        return 'Please upload image, with size equal or less than 10MB';
    }
}));