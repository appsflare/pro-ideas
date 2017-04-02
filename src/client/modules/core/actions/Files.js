export default {

    removeImageFile({ Meteor, LocalState }, imageId) {
        return new Promise((resolve, reject) => {
            Meteor.call('images.remove', { imageId }, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            })
        });
    },

    uploadImage({ Meteor, LocalState, FlowRouter, Collections: { Images } }, file, linkedDocId) {

        const userId = Meteor.userId();

        const uploadInstance = Images.insert({
            file,
            meta: {
                public: true,
                linkedDocId,
                userId  // Optional, used to check on server for file tampering
            },
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false);


        uploadInstance.on('error', function (error, fileObj) {
            LocalState.set('IMAGE_UPLOAD_ERROR', error);
        });

        uploadInstance.start(); // Must manually start the upload

        return uploadInstance;

    },

    uploadImageClearErrors({ LocalState }, imagefile, linkedDocId) {

        LocalState.set('IMAGE_UPLOAD_ERROR', null);

    }

};