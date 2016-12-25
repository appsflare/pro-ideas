import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

export default class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const fullName = this.refs.fullName.value;
    const password = this.refs.password.value;
    const confirmPassword = this.refs.confirmPassword.value;
    const errors = {};


    if (!fullName) {
      errors.fullName = 'Full Name required';
    }

    if (!email) {
      errors.email = 'Email required';
    }

    if (!password) {
      errors.password = 'Password required';
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Please confirm your password';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email,
      password,
      profile: {
        fullName: fullName
      }
    }, err => {
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
    const errorClass = key => errors[key] && 'has-error';

    const content = (

      <div className="login-box-body">
        <h1 className="title-auth">Join.</h1>
        <p className="login-box-msg">Joining now and share your ideas with rest of the world</p>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)} >
          <div className="list-errors">
            {errorMessages.length ? <div className="alert alert-danger" role="alert">
              {errorMessages.map(msg => (
                <div className="list-item" key={msg}>{msg}</div>
              ))}
            </div>
              : null
            }

          </div>
          <div className={`form-group ${errorClass('fullName')}`}>
            <div className="col-sm-12">
              <input type="text" name="fullName" ref="fullName" className="form-control" placeholder="Full Name" />
            </div>
          </div>
          <div className={`form-group ${errorClass('email')}`}>
            <div className="col-sm-12">
              <input type="email" name="email" ref="email" className="form-control" placeholder="Email" />
            </div>
          </div>
          <div className={`form-group ${errorClass('password')}`}>
            <div className="col-sm-12">
              <input type="password" name="password" ref="password" className="form-control" placeholder="Password" />
            </div>
          </div>
          <div className={`form-group ${errorClass('confirmPassword')}`}>
            <div className="col-sm-12">
              <input type="password" name="confirmPassword" ref="confirmPassword" className="form-control" placeholder="Confirm Password" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-flat btn-primary">Join Now</button>
            </div>
          </div>
        </form>
        <a href="/auth/signin" className="text-center">Already have an account? Sign in.</a>
      </div>
    );

    const link = <Link to="/signin" className="link-auth-alt">Have an account?Sign in</Link>;

    return <AuthPage content={content} link={link} />;
  }
}

JoinPage.contextTypes = {
  router: React.PropTypes.object,
};
