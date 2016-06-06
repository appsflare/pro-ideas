import React, { Component, PropTypes } from 'react';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem} from 'react-bootstrap';
import {CreateIdeaForm} from '../components/create-idea-form';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';
// App component - represents the whole app
export default class AppContainer extends Component {

    get currentUser() {
        return Meteor.userId();
    }

    render() {
        return (
            <div>
                <header>
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#">Pro-Ideas</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Nav>
                        <NavItem eventKey={1} href="/ideas">Ideas</NavItem>
                            <NavItem>
                                <AccountsUIWrapper />
                            </NavItem>
                        </Nav>
                    </Navbar>
                </header>
                <section className="container">


                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">Have an idea flashing in your head?</h3> </div>
                        <div className="panel-body">
                            {this.currentUser ? <CreateIdeaForm/> : 'Please login to start posting ideas!!!'}
                        </div>
                    </div>

                    {this.props.children}
                </section>
            </div>
        );

    }
}