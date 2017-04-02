import React from 'react';
import Formsy from 'formsy-react';
import { RichTextEditor } from '/client/lib/RichTextEditor.jsx';
import { ExtendedInput } from '/client/lib/ExtendedInput.jsx';

import editorConfig from '/client/configs/editor';

import ImageUploadWrapper from '/client/modules/core/components/fileUpload/file-upload-wrapper.jsx';

import FileUploaderComposer from '/client/modules/core/containers/image-upload-container';

const FileUploader = FileUploaderComposer(ImageUploadWrapper);


export default class IdeaImages extends React.Component {

    constructor() {
        super(...arguments);
        this._setInitialState();
    }

    _setInitialState() {
        this.state = {
            poster: '',
            error: ''
        };
    }



    onPosterContentChanged(poster) {
        this.setState({ poster });
    }


    validSubmit() {

    }

    onFormValid() {
        // console.log('enable button');
        this.setState({ canSubmit: true });
    }

    onFormInvalid() {
        // console.log('disable button');
        this.setState({ canSubmit: false });
    }

    isValid() {
        return this.state.canSubmit;
    }

    render() {
        const panelId = 'info-panel';
        const panelSel = `#${panelId}`;
        const sharedProps = {
            layout: this.state.layout,
            validatePristine: this.state.validatePristine,
            disabled: this.state.disabled
        };
        const { imageOnly } = editorConfig;
        return (
            <Formsy.Form ref="form"
                onValid={this.onFormValid.bind(this)}
                onInvalid={this.onFormInvalid.bind(this)}
                onValidSubmit={this.validSubmit.bind(this)}>

                <div className="form-group">
                    <div className="col-sm-12 short-text">
                        <FileUploader />
                    </div>
                </div>





            </Formsy.Form>);
    }

}