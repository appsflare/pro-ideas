import React, { Component, PropTypes } from 'react';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

// App component - represents the whole app
export default class AppAuthContainer extends Component {

    get currentUser() {
        return Meteor.userId();
    }

    componentWillMount() {
        if (this.currentUser) {
            this.context.router.push('/');
            return;
        }
    }

    render() {
        return (
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <a href="/"><img src="/icons/logo.png" /></a>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );

    }
}