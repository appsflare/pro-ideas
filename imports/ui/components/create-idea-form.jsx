import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import uuid from 'uuid';

export default class CreateIdeaForm extends Component {

  constructor(){
    super(...arguments);    
    this._setInitialState();
  }

  _setInitialState(){
    this.state = {
      name:'',
      businessValue:'',
      definitionOfSuccess:'',
      isFundingRequired: false,
      requiredFund:0
    };    
  }

  onIsFundingRequiredChanged(){    
    this.setState({isFundingRequired : !this.state.isFundingRequired});
  }

  onInputChange(e){    
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
        isFundingRequired: this.state.isFundingRequired, 
        requiredFund: this.state.requiredFund   
      };
   

    Meteor.call('ideas.insert', newIdea);

    // Clear form
    this._setInitialState();
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
      panelSel = `#${panelId}`;

    return (
      <div ref="formContainer">

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <input type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this)} ref="nameInput" className="form-control" placeholder="New Idea"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <textarea ref="descInput" name="businessValue" value={this.state.businessValue} onChange={this.onInputChange.bind(this)} className="form-control" rows="3" placeholder="Business value"></textarea>
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
                  <textarea ref="dosInput" name="definitionOfSuccess" value={this.state.definitionOfSuccess} onChange={this.onInputChange.bind(this)} className="form-control" rows="3" placeholder="Definition of Success"></textarea>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-12">
                  <div className="checkbox">
                    <label><input type="checkbox" onChange={this.onIsFundingRequiredChanged.bind(this)} checked={this.state.isFundingRequired}/> Funding required?</label>
                  </div>
                </div>
              </div>
              {this.state.isFundingRequired ?
                <div className="form-group">
                  <div className="col-sm-12">
                    <input type="number" name="requiredFund" value={this.state.requiredFund} onChange={this.onInputChange.bind(this)} className="form-control" placeholder="Required Fund"/>
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

