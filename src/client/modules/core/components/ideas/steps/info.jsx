import React from 'react';
import Formsy from 'formsy-react';
import { RichTextEditor } from '/client/lib/RichTextEditor.jsx';
import { ExtendedInput } from '/client/lib/ExtendedInput.jsx';

import editorConfig from '/client/configs/editor';

export default class IdeaInfo extends React.Component {

    constructor() {
        super(...arguments);
        this._setInitialState();
    }

    _setInitialState() {
        this.state = {
            layout: 'elementOnly',
            validatePristine: true,
            disabled: false,
            canSubmit: false,
            name: '',
            description: '',
            isFundingRequired: false,
            fundingRequirement: '',
            error: ''
        };
    }

    onInputChange(e) {
        let partialState = {};
        partialState[e.target.name] = e.target.value;
        this.setState(partialState);
    }

    onIsFundingRequiredChanged() {
        this.setState({ isFundingRequired: !this.state.isFundingRequired });
    }

    onDescriptionChanged(description) {
        this.setState({ description });
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
        const {shortText} = editorConfig;
        return (
            <Formsy.Form ref="form"
                onValid={this.onFormValid.bind(this)}
                onInvalid={this.onFormInvalid.bind(this)}
                onValidSubmit={this.validSubmit.bind(this)}>
                <div className="form-group">
                    <div className="col-sm-12">
                        <ExtendedInput
                            {...sharedProps}
                            className="form-control"
                            name="name"
                            type="text"
                            placeholder="Name your idea..."
                            autoComplete="off"
                            validationError="Ides name is required"
                            value={this.state.name} onChange={this.onInputChange.bind(this)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-12 short-text">
                        <RichTextEditor modules={shortText.modules} formats={shortText.formats} placeholder="Decribe your idea" onChange={this.onDescriptionChanged.bind(this)} />
                    </div>
                </div>

                {/*<div className="form-group">
                    <div className="col-sm-12">
                        <button type="button" className="btn btn-link pull-right" data-toggle="collapse" data-target={panelSel}>Add more details</button>
                    </div>
                </div>*/}


                <div className="form-group">
                    <div className="col-sm-12">
                        <div className="checkbox">
                            <div className="togglebutton">
                                <label>
                                    My idea requires funding &nbsp;
                                    <input type="checkbox" onChange={this.onIsFundingRequiredChanged.bind(this)} checked={this.state.isFundingRequired} />
                                    <span className="toggle" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isFundingRequired ?
                    <div className="col-sm-12 short-text">
                        <RichTextEditor modules={shortText.modules} formats={shortText.formats} placeholder="Decribe your funding requirement" onChange={this.onDescriptionChanged.bind(this)}>
                        </RichTextEditor>
                    </div>
                    : ''}
            </Formsy.Form>);
    }

}