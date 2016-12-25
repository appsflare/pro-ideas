import React from 'react';
import { Link } from 'react-router';
import {Nav, NavDropdown, MenuItem, NavItem} from 'react-bootstrap';

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


    return (<NavDropdown eventKey={4} title={fullName} id="nav-dropdown">
      <MenuItem href="/my-ideas">My Ideas</MenuItem>
      <MenuItem divider />
      <MenuItem href="/change-password">Change Password</MenuItem>
      <MenuItem onClick={logout}>Sign Out</MenuItem>
    </NavDropdown>);
  }

  renderLoggedOut() {
    return (
      <NavDropdown eventKey={4} title="Join/Sign In" id="nav-dropdown">
        <MenuItem eventKey="4.1" href="/auth/join">Join</MenuItem>
        <MenuItem eventKey="4.2" href="/auth/signin">Sign In</MenuItem>
      </NavDropdown>
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
