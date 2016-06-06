import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

export class CreateIdeaForm extends Component {

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    let nameInput = ReactDOM.findDOMNode(this.refs.nameInput);
    let descInput = ReactDOM.findDOMNode(this.refs.descInput);

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    Meteor.call('ideas.insert', name, description);

    // Clear form
    nameInput.value = '';
    descInput.value = '';
  }
  
  get currentUser(){
    return Meteor.userId();
  }



  render() {
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <input type="text" name="name"  ref="nameInput" className="form-control" placeholder="New Idea"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <textarea ref="descInput" className="form-control" rows="3" placeholder="More about your idea!"></textarea>
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
