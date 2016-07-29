import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Input, Row, Col, Collapsible, CollapsibleItem } from 'react-materialize';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../api/ideas/methods';
import uuid from 'uuid';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import './CreateIdeaForm.scss'

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

      this.refs.businessValue && this.refs.businessValue.medium.setContent('')
      this.refs.definitionOfSuccess && this.refs.definitionOfSuccess.medium.setContent('')
      this.refs.fundingRequirement && this.refs.fundingRequirement.medium.setContent('')

      // Clear form
      this._setInitialState();


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
  }

  render() {
    let panelId = `panel-${uuid.v1()}`,
      panelSel = `#${panelId}`,
      {error} = this.state;
    return (
      <div className="create-idea-form" ref="formContainer">

        {error ?
          <div className="alert alert-danger" role="alert">
            {error}
          </div> : ''}

        <Row>
          <form onSubmit={this.handleSubmit.bind(this) } >

            <Input s={12} type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this) } label="New Idea"/>


            <Col s={12} className="input-field">
              <Icon className="prefix">business</Icon>
              <ReactMarkdownMediumEditor className="md-editor" ref="businessValue"
                options={{ toolbar: { static: true }, placeholder: { text: 'Click here to describe Business value' } }}
                markdown={this.state.businessValue}
                onChange={this.businessValueUpdated}/>
            </Col>


            <Col s={12}>
              <Collapsible popout>
                <CollapsibleItem header='I have more details!' icon='speaker_notes'>
                  <Col s={12} className="input-field">
                    <Icon className="prefix">done_all</Icon>
                    <ReactMarkdownMediumEditor className="md-editor" ref="definitionOfSuccess"
                      options={{ placeholder: { text: 'Click here to describe Definition of Success' } }}
                      markdown={this.state.definitionOfSuccess}
                      onChange={this.definitionOfSuccessUpdated}/>
                  </Col>

                  <Col s={12}>
                    <Input type='checkbox' value='red' label="Funding required?"
                      checked={this.state.isFundingRequired}
                      onChange={this.onIsFundingRequiredChanged.bind(this) } />
                  </Col>
                  {this.state.isFundingRequired ?
                    <Col s={12} className="input-field">
                      <Icon className="prefix">receipt</Icon>
                      <ReactMarkdownMediumEditor className="md-editor" ref="fundingRequirement"
                        options={{ placeholder: { text: 'Click here to Explain your fuding requirement in detail' } }}
                        markdown={this.state.fundingRequirement}
                        onChange={this.fundingRequirementUpdated}/>
                    </Col>
                    : ''}
                </CollapsibleItem>
              </Collapsible>
            </Col>
            <div className="form-group">
              <div className="col-sm-12">
                <Button>Post it!</Button>
              </div>
            </div>
          </form>
        </Row>
      </div >
    );
  }
}

