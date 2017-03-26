import React from 'react';
import Formsy from 'formsy-react';
import { RichTextEditor } from '/client/lib/RichTextEditor.jsx';

class IdeaInfo extends React.Component {

    constructor() {
        super(...arguments);
        this._setInitialState();
    }

    _setInitialState() {
        this.state = {
            name: '',
            businessValue: '',
            definitionOfSuccess: '',
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

    validSubmit() {

    }

    render() {
        const panelId = 'info-panel';
        const panelSel = `#${panelId}`;
        return (
            <Formsy.Form ref="form"
                onValidSubmit={this.validSubmit.bind(this)}
            >

                

                <div className="form-group">
                    <div className="col-sm-12">
                        <input type="text" name="name" value={this.state.name} onChange={this.onInputChange} ref="nameInput" className="form-control" placeholder="New Idea" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-12">
                        <RichTextEditor placeholder="Decribe your idea" onChange={this.businessValueUpdated} />
                    </div>
                </div>

                {/*<div className="form-group">
                    <div className="col-sm-12">
                        <button type="button" className="btn btn-link pull-right" data-toggle="collapse" data-target={panelSel}>Add more details</button>
                    </div>
                </div>*/}

                <div className="collapse" id={panelId}>
                    <div className="well">
                        <div className="form-group">
                            <div className="col-sm-12">
                                <div className="form-control auto-height">
                                    {/*<ReactMarkdownMediumEditor ref="definitionOfSuccess"
                                        options={{ placeholder: { text: 'Click here to describe Definition of Success' } }}
                                        markdown={this.state.definitionOfSuccess}
                                        onChange={this.definitionOfSuccessUpdated} />*/}
                                </div>

                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-12">
                                <div className="checkbox">
                                    <label><input type="checkbox" onChange={this.onIsFundingRequiredChanged.bind(this)} checked={this.state.isFundingRequired} /> Funding required?</label>
                                </div>
                            </div>
                        </div>
                        {this.state.isFundingRequired ?
                            <div className="form-group">
                                <div className="col-sm-12">
                                    <div className="form-control auto-height">
                                        {/*<ReactMarkdownMediumEditor ref="fundingRequirement"
                                            options={{ placeholder: { text: 'Click here to Explain your fuding requirement in detail' } }}
                                            markdown={this.state.fundingRequirement}
                                            onChange={this.fundingRequirementUpdated} />*/}
                                    </div>
                                </div>
                            </div>
                            : ''}

                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-12">
                        <button type="submit" className="btn btn-raised btn-primary btn-flat">Post it!</button>
                    </div>
                </div>

            </Formsy.Form>);
    }

}

export default IdeaInfo;