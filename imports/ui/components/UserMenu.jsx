import React from 'react';
import { Link } from 'react-router';
import {Navbar, Dropdown, NavItem} from 'react-materialize';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  renderLoggedIn() {
    const { open } = this.state;
    const { user, logout } = this.props;
    const fullName = user.profile.fullName;


    return (<Dropdown eventKey={4} title={fullName} id="nav-dropdown">
      <NavItem href="/my-ideas">My Ideas</NavItem>
      <NavItem divider />
      <NavItem href="/change-password">Change Password</NavItem>
      <NavItem onClick={logout}>Sign Out</NavItem>
    </Dropdown>);
  }

  renderLoggedOut() {
    return (
      <Navbar>
        <NavItem href="/join">Join</NavItem>
        <NavItem href="/signin">Sign In</NavItem>
      </Navbar>
    );
  }

  render() {
    return this.props.user
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

UserMenu.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
