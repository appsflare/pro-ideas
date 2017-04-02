import { Component } from 'react';

import dataComposer from '../../containers/image-upload-container';
import imageDataComposer from '../../containers/image-container';

import FileUploadInput from './file-upload-input.jsx';
import FileUploadProgress from './file-upload-progress.jsx';
import FilePreview from './file-preview.jsx';

const FilePreviewer = imageDataComposer(FilePreview);

class FileUploadWrapper extends Component {

    constructor() {
        super(...arguments);
        this._setInitialState();
    }

    _getInitialState() {
        return {
            uploading: null,
            fileName: '',
            progress: 0,
            inProgress: false,
            error: null
        };
    }

    _setInitialState() {

        this.state = this._getInitialState();

    }

    resetState() {
        this.setState(this._getInitialState());
    }

    bindState(uploadInstance) {


        this.setState({
            uploading: uploadInstance, // Keep track of this instance to use below
            fileName: uploadInstance.file.name,
            inProgress: true // Show the progress bar now
        });


        uploadInstance.on('uploaded', (error, fileObj) => {

            // Reset our state for the next file
            this.setState({
                inProgress: false,
                uploadedFile: fileObj
            });
        });

        uploadInstance.on('error', (error, fileObj) => {
            this.setState({ error })
        });

        uploadInstance.on('progress', (progress, fileInfo) => {
            this.setState({
                progress: progress,
                fileInfo
            });
        });
    }

    renderProgress() {
        return (<FileUploadProgress {...this.state} />);
    }


    upload(file) {
        const { upload } = this.props;

        const uploadInstance = upload(file);
        this.bindState(uploadInstance);
    }

    renderPreview() {
        const { uploadedFile } = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                    <FilePreviewer imageId={uploadedFile._id} />
                </div>
            </div>
        );
    }


    renderProgress() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <FileUploadProgress {...this.state} />
                </div>
            </div>
        );
    }

    renderFilePicker() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <FileUploadInput {...this.state} upload={this.upload.bind(this)} />
                </div>
            </div>
        );
    }

    render() {

        const { inProgress, fileInfo, uploadedFile } = this.state;

        return (
            <div>
                {!inProgress && !uploadedFile ? this.renderFilePicker() : null}
                {uploadedFile ? this.renderPreview() : null}
                {inProgress ? this.renderProgress() : null}

            </div>
        );

    }


}

export default dataComposer(FileUploadWrapper);