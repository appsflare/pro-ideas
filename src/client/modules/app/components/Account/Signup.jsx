import React, { Component } from 'react';
import FormsyReact from 'formsy-react';
import { Input } from 'formsy-react-components';

export default class Signup extends Component {

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

        return (<div className="col-md-5">
            <div className="social text-center">
                <button className="btn btn-just-icon btn-round btn-twitter">
                    <i className="fa fa-twitter" />
                </button>
                <button className="btn btn-just-icon btn-round btn-dribbble">
                    <i className="fa fa-dribbble" />
                </button>
                <button className="btn btn-just-icon btn-round btn-facebook">
                    <i className="fa fa-facebook"> </i>
                </button>
                <h4> or be classical </h4>
            </div>
            <form className="form" method action>
                <div className="content">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="material-icons">face</i>
                        </span>
                        <div className="form-group is-empty"><input type="text" className="form-control" placeholder="First Name..." /><span className="material-input" /></div>
                    </div>
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
                    {/* If you want to add a checkbox to this form, uncomment this code */}
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" name="optionsCheckboxes" defaultChecked /><span className="checkbox-material"><span className="check" /></span>
                            I agree to the <a href="#something">terms and conditions</a>.
                            </label>
                    </div>
                </div>
                <div className="footer text-center">
                    <a href="#pablo" className="btn btn-primary btn-round">Get Started</a>
                </div>
            </form>
        </div>);
    }
}