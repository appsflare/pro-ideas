import { Meteor } from 'meteor/meteor';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';

export default function useGridFS(baseOptions = {}) {

    let gfs;
    if (Meteor.isServer) {
        gfs = Grid(
            MongoInternals.defaultRemoteCollectionDriver().mongo.db,
            MongoInternals.NpmModule
        );
    }

    const gridFSOptions = {
        onAfterUpload(file) {
            // Move file to GridFS
            Object.keys(file.versions).forEach(versionName => {
                const metadata = { versionName, imageId: file._id, storedAt: new Date() }; // Optional
                const writeStream = gfs.createWriteStream({ filename: file.name, metadata });

                fs.createReadStream(file.versions[versionName].path).pipe(writeStream);

                writeStream.on('close', Meteor.bindEnvironment(file => {
                    const property = `versions.${versionName}.meta.gridFsFileId`;

                    // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
                    // LocalCollection.ObjectID, which GFS doesn't understand.
                    this.collection.update(file._id, { $set: { [property]: file._id.toString() } });
                    this.unlink(this.collection.findOne(file._id), versionName); // Unlink files from FS
                }));
            });
        },
        interceptDownload(http, file, versionName) {
            // Serve file from GridFS
            const _id = (file.versions[versionName].meta || {}).gridFsFileId;
            if (_id) {
                const readStream = gfs.createReadStream({ _id });
                readStream.on('error', err => { throw err; });
                readStream.pipe(http.response);
            }
            return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
        },
        onAfterRemove(files) {
            // Remove corresponding file from GridFS
            files.forEach(image => {
                Object.keys(image.versions).forEach(versionName => {
                    const _id = (image.versions[versionName].meta || {}).gridFsFileId;
                    if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
                });
            });
        }
    };

    return Object.assign(baseOptions, gridFSOptions);
};