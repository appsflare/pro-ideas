import { Meteor } from 'meteor/meteor';
import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const errors = {};

    if (!email) {
      errors.email = 'Email required';
    }
    if (!password) {
      errors.password = 'Password required';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }

  _handleLogin(err) {
    if (err) {
      this.setState({
        errors: { login: err.message },
      });

      return;
    }

    this.context.router.push('/');
  }

  signinUsingGitHub() {
    Meteor.loginWithGithub(this._handleLogin.bind(this));
  }

  signinUsingFacebook() {
    Meteor.loginWithFacebook(this._handleLogin.bind(this));
  }

  signinUsingGoogle() {
    Meteor.loginWithGoogle(this._handleLogin.bind(this));
  }

  render() {
    const { errors } = this.state;    
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';
    let errorIndex = 0;

    const content = (
      <div className="login-box-body">
        <p className="login-box-msg">Sign in to start sharing your ideas</p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.length ? <div className="alert alert-danger" role="alert">
              {errorMessages.map(msg => (
                <div key={`errorIndex-${errorIndex++}`} className="list-item" key={msg}>{msg}</div>
              ))}
            </div>
              : null
            }
          </div>
          <div className="form-group has-feedback">
            <input type="email" name="email" ref="email" className="form-control" placeholder="Email" />
            <span className="glyphicon glyphicon-envelope form-control-feedback" />
          </div>
          <div className="form-group has-feedback">
            <input type="password" name="password" ref="password" className="form-control" placeholder="Password" />
            <span className="glyphicon glyphicon-lock form-control-feedback" />
          </div>
          <div className="row">
            <div className="col-xs-8">
              {/*<div className="checkbox icheck">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
              </div>*/}
            </div>
            {/* /.col */}
            <div className="col-xs-4">
              <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
            </div>
            {/* /.col */}
          </div>
        </form>
        <div className="social-auth-links text-center">
          <p>- OR -</p>
          <button className="btn btn-block btn-social btn-github btn-flat" onClick={this.signinUsingGitHub.bind(this)}><i className="fa fa-github" /> Sign in using
            GitHub</button>
          <button className="btn btn-block btn-social btn-facebook btn-flat" onClick={this.signinUsingFacebook.bind(this)}><i className="fa fa-facebook" /> Sign in using
            Facebook</button>
          <button href="#" className="btn btn-block btn-social btn-google btn-flat" onClick={this.signinUsingGoogle.bind(this)}><i className="fa fa-google-plus" /> Sign in using
            Google+</button>
        </div>
        {/* /.social-auth-links */}
        {/* <a href="#">I forgot my password</a><br />*/}
        <a href="/auth/join" className="text-center">Need an account? Join Now.</a>
      </div>
    );

    return <AuthPage content={content} />;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};
