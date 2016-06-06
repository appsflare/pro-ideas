import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

export class Register extends Component {

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    let fullNameInput = ReactDOM.findDOMNode(this.refs.fullNameInput);
    let emailInput = ReactDOM.findDOMNode(this.refs.emailInput);
    let passwordInput = ReactDOM.findDOMNode(this.refs.passwordInput);   


    Accounts.createUser({
       email: emailInput.value,
       fullName: fullNameInput.value,
       password: passwordInput.value
    });
    
    Accounts.login({
       email: emailInput.value,       
       password: passwordInput.value
    });

    window.local.href = '/';
    
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
        {this.currentUser ? '':
        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <input type="text" name="fullName"  ref="fullNameInput" className="form-control" placeholder="Full Name"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input type="email" name="email"  ref="emailInput" className="form-control" placeholder="Email"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input type="password" name="password"  ref="passwordInput" className="form-control" placeholder="Password"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
          </div>
        </form>
        }
      </div>
    );
  }
}
