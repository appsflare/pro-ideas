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

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="container">
        <h1 className="title-auth">Sign In.</h1>
        <p className="subtitle-auth">Signing in allows you to view and manage your ideas</p>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <div className="list-errors">
            { errorMessages.length ? <div className="alert alert-danger" role="alert">
              {errorMessages.map(msg => (
                <div className="list-item" key={msg}>{msg}</div>
              )) }
            </div>
              : null
            }
          </div>
          <div className={`form-group ${errorClass('email')}`}>
            <div className="col-sm-12">
              <input type="email" name="email"  ref="email" className="form-control" placeholder="Email"/>
            </div>
          </div>
          <div className={`form-group ${errorClass('password')}`}>
            <div className="col-sm-12">
              <input type="password" name="password"  ref="password" className="form-control" placeholder="Password"/>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Sign in</button>
        </form>
      </div>
    );

    const link = <Link to="/join" className="link-auth-alt">Need an account? Join Now.</Link>;

    return <AuthPage content={content} link={link}/>;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};
