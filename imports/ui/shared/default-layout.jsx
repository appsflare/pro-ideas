import React, { Component, PropTypes } from 'react';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem} from 'react-bootstrap';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';
// App component - represents the whole app
export class DefaultLayout extends Component {

    get currentUser() {
        return Meteor.userId();
    }

    constructor() {       
        super(...arguments);
        this._listenForUser();
    }

    _listenForUser(){
         if (!Meteor.userId()) {
            Tracker.autorun(() => {
                if (Meteor.users.find({ _id: Meteor.userId() }).count() > 0) {
                    window.location.reload();
                }
            });
        }
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
                                
                            </NavItem>
                        </Nav>
                    </Navbar>

                </header>
                <section className="container">
                    {this.props.content}
                </section>
                <footer>
                    {this.props.footer || ''}
                </footer>
            </div>
        );

    }
}