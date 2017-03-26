import React, { Component } from 'react';
import FormsyReact from 'formsy-react';
import { ExtendedInput } from './ExtendedInput.jsx';

export default class Signup extends Component {

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

    validSubmit({firstName, email, password}) {
        // console.log('validSubmit', data);
        this.props.submitAction(firstName, email, password);
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
            <FormsyReact.Form className={formClassName}
                onValidSubmit={this.validSubmit.bind(this)}
                onInvalidSubmit={this.invalidSubmit.bind(this)}
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onChange={this.onChange.bind(this)}>
                <div className="content">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="material-icons">face</i>
                        </span>
                        <ExtendedInput
                            {...sharedProps}
                            className="form-control"
                            name="firstName"
                            value=""
                            type="text"
                            placeholder="First Name..." />
                    </div>
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
                    {/* If you want to add a checkbox to this form, uncomment this code */}
                    {/*<div className="checkbox">
                        <label>
                            <input type="checkbox" name="optionsCheckboxes" defaultChecked /><span className="checkbox-material"><span className="check" /></span>
                            I agree to the <a href="#something">terms and conditions</a>.
                            </label>
                    </div>*/}
                </div>
                <div className="footer text-center">
                    <button className="btn btn-primary btn-simple btn-wd btn-lg"
                        formNoValidate={true}
                        disabled={!this.state.canSubmit}
                        type="submit">Get In<div className="ripple-container" /></button>
                </div>
            </FormsyReact.Form>
        </div>);
    }
}