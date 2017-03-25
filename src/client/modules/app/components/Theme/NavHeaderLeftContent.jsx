import React from 'react';
import DropDown from './NavDropDown.jsx';

export default class extends React.Component {

  render() {

    const { userId } = this.props;


    var links4 = [];
    links4.push({ url: '/admin', name: '/admin' });
    links4.push({ url: '/users', name: '/users' });
    links4.push({ url: '/users/add', name: '/users/add' });
    let navAdmin = React.createElement(DropDown, { name: 'Admin', links: links4 });

    var links5 = [];
    links5.push({ url: '/login', name: 'Login' });
    links5.push({ url: '/password', name: 'Forgot passoword' });
    links5.push({ url: '/register', name: 'Register' });
    links5.push({ url: '/Logout', name: 'Logout' });

    links5.push({ url: '/account', name: 'Account' });
    links5.push({ url: '/profile', name: 'Profile' });

    let navAccounts = React.createElement(DropDown, { name: 'Accounts', links: links5 });

    return (
      <ul className="nav navbar-nav">

        <li className="">
          <a aria-expanded="false" role="button" href="/" target="">Start</a>
        </li>

        <li className="">
          <a aria-expanded="false" role="button" href="/blog" target="">Blog</a>
        </li>

        {navAccounts}

        {userId ? navAdmin : null}

      </ul>
    );
  }

};
