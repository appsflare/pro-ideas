import React, { Component } from 'react';
import FormsyReact from 'formsy-react';
import { Input } from 'formsy-react-components';

export default class Login extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            layout: 'vertical',
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

    signinUsingGitHub() {

    }

    signinUsingFacebook() {

    }

    signinUsingGoogle() {

    }


    render() {
        const { errorMessages = [] } = this.props;
        return (<form className="form" method action>
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
                  <div className="content">                    
                    <div className="input-group">
                      <span className="input-group-addon">
                        <i className="material-icons">email</i>
                      </span>
                      <div className="form-group is-empty"><input type="text" className="form-control" placeholder="Email..." /><span className="material-input" /></div>
                    </div>
                    <div className="input-group">
                      <span className="input-group-addon">
                        <i className="material-icons">lock_outline</i>
                      </span>
                      <div className="form-group is-empty"><input type="password" placeholder="Password..." className="form-control" /><span className="material-input" /></div>
                    </div>
                    
                  </div>
                  <div className="footer text-center">
                    <a href="#pablo" className="btn btn-primary btn-simple btn-wd btn-lg">Get Started<div className="ripple-container" /></a>
                  </div>
                </form>);
    }
}