import React, { Component } from 'react';
import FormsyReact from 'formsy-react';
import { ExtendedInput } from '/client/lib/ExtendedInput.jsx';

export default class Login extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      layout: 'elementOnly',
      validatePristine: true,
      disabled: false,
      canSubmit: false
    };
  }

  resetForm() {
    this.refs.form.reset();
  }

  validSubmit(data) {
    // console.log('validSubmit', data);
    this.props.submitAction(data.email, data.password);
  }

  // invalidSubmit(data) {
  invalidSubmit() {
    // console.log('invalidSubmit', data);
  }

  enableButton() {
    // console.log('enable button');
    this.setState({ canSubmit: true });
  }

  disableButton() {
    // console.log('disable button');
    this.setState({ canSubmit: false });
  }

  onChange() {

  }

  signinUsingGitHub() {

  }

  signinUsingFacebook() {

  }

  signinUsingGoogle() {

  }


  render() {

    const formClassName = 'form';

    var sharedProps = {
      layout: this.state.layout,
      validatePristine: this.state.validatePristine,
      disabled: this.state.disabled
    };

    const { error } = this.props;



    return (<Formsy.Form className={formClassName}
      onValidSubmit={this.validSubmit.bind(this)}
      onInvalidSubmit={this.invalidSubmit.bind(this)}
      onValid={this.enableButton.bind(this)}
      onInvalid={this.disableButton.bind(this)}
      onChange={this.onChange.bind(this)}
      ref="form">
      <div className="header header-primary text-center">
        <h4 className="card-title">Log In</h4>
        <div className="social-line">
          <a href="#pablo" className="btn btn-just-icon btn-simple">
            <i className="fa fa-facebook-square" />
          </a>
          <a href="#pablo" className="btn btn-just-icon btn-simple">
            <i className="fa fa-twitter" />
          </a>
          <a href="#pablo" className="btn btn-just-icon btn-simple">
            <i className="fa fa-google-plus" />
          </a>
        </div>
      </div>
      <p className="description text-center">Or Be Classical</p>
      {error ?
        <div className="alert alert-danger">
          <div className="alert-icon">
            <i className="material-icons">error_outline</i>
          </div>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span><i className="material-icons">clear</i></span>
          </button>
          {error}
        </div> : null}
      <div className="content">
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">email</i>
          </span>
          <ExtendedInput
            {...sharedProps}
            className="form-control"
            name="email"
            value=""
            type="email"
            placeholder="Email..."
            autoComplete="off"
            validations="isEmail"
            validationError="Please provide a valid email address."
          />
        </div>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">lock_outline</i>
          </span>
          <ExtendedInput
            {...sharedProps}
            className="form-control"
            name="password"
            value=""
            type="password"
            placeholder="Password..."
            validations="minLength:8"
            validationError="That password looks a bit short, try again"
          />
        </div>

      </div>
      <div className="footer text-center">
        <button className="btn btn-primary btn-simple btn-wd btn-lg"
          formNoValidate={true}
          disabled={!this.state.canSubmit}
          type="submit">Get In<div className="ripple-container" /></button>
      </div>
    </Formsy.Form>);
  }
}