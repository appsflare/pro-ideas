import { FilesCollection } from 'meteor/ostrio:files';
import useGridFS from './gridfs';

export const Videos = new FilesCollection(useGridFS({
    collectionName: 'Videos',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 1e+8 && /mp4/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload video of type mp4, with size equal or less than 100MB';
        }
    }
}));