import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../api/ideas/methods';
import uuid from 'uuid';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'

export default class CreateIdeaForm extends Component {

  constructor() {
    super(...arguments);
    this.businessValueUpdated = this.businessValueUpdated.bind(this)
    this.definitionOfSuccessUpdated = this.definitionOfSuccessUpdated.bind(this)
    this.fundingRequirementUpdated = this.fundingRequirementUpdated.bind(this)
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

  onIsFundingRequiredChanged() {
    this.setState({ isFundingRequired: !this.state.isFundingRequired });
  }

  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  handleSubmit(event) {
    event.preventDefault();

    const newIdea = {
      name: this.state.name.trim(),
      businessValue: this.state.businessValue.trim(),
      definitionOfSuccess: this.state.definitionOfSuccess.trim(),
      fundingRequirement: this.state.fundingRequirement.trim()
    };


    insert.call(newIdea, err => {

      if (err) {
        this.setState({ error: err.reason });
      }

      // Clear form
      this._setInitialState();

      this.refs.businessValue.medium.setContent('')
      this.refs.definitionOfSuccess.medium.setContent('')
      this.refs.fundingRequirement.medium.setContent('')
      


    });

  }

  businessValueUpdated(data) {
    this.setState({ businessValue: data })
  }

  definitionOfSuccessUpdated(data) {
    this.setState({ definitionOfSuccess: data })
  }

  fundingRequirementUpdated(data) {
    this.setState({ fundingRequirement: data })
  }


  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {
    const $formContainer = $(ReactDOM.findDOMNode(this.refs.formContainer));
    $formContainer.find('[data-toggle="collapse"]').collapse();
  }

  render() {
    let panelId = `panel-${uuid.v1()}`,
      panelSel = `#${panelId}`,
      {error} = this.state;

    return (
      <div ref="formContainer">

        {error ?
          <div className="alert alert-danger" role="alert">
            {error}
          </div> : ''}

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <input type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this) } ref="nameInput" className="form-control" placeholder="New Idea"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <div className="form-control">

                <ReactMarkdownMediumEditor ref="businessValue"                
                  options={{ placeholder: { text: 'Click here to describe Business value' } }}
                  markdown={this.state.businessValue}
                  onChange={this.businessValueUpdated}/>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <button type="button" className="btn btn-link pull-right" data-toggle="collapse" data-target={panelSel}>Add more details</button>
            </div>
          </div>

          <div className="collapse" id={panelId}>
            <div className="well">
              <div className="form-group">
                <div className="col-sm-12">
                  <div className="form-control">
                    <ReactMarkdownMediumEditor ref="definitionOfSuccess"  
                      options={{ placeholder: { text: 'Click here to describe Definition of Success' } }}
                      markdown={this.state.definitionOfSuccess}
                      onChange={this.definitionOfSuccessUpdated}/>
                  </div>

                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-12">
                  <div className="checkbox">
                    <label><input type="checkbox" onChange={this.onIsFundingRequiredChanged.bind(this) } checked={this.state.isFundingRequired}/> Funding required?</label>
                  </div>
                </div>
              </div>
              {this.state.isFundingRequired ?
                <div className="form-group">
                  <div className="col-sm-12">
                    <div className="form-control">
                      <ReactMarkdownMediumEditor ref="fundingRequirement"
                        options={{ placeholder: { text: 'Click here to Explain your fuding requirement in detail' } }}
                        markdown={this.state.fundingRequirement}
                        onChange={this.fundingRequirementUpdated}/>
                    </div>
                  </div>
                </div>
                : ''}

            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">Post it!</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

