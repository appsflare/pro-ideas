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
    links5.push({ url: '/categories/technology', name: 'Development' });
    links5.push({ url: '/categories/dev-ops', name: 'Dev Ops' });
    links5.push({ url: '/categories/qa', name: 'QA' });
    links5.push({ url: '/categories/agile', name: 'Agile' });

    links5.push({ url: '/categories/iot', name: 'IoT' });
    links5.push({ url: '/categories/mobility', name: 'Mobility' });
    links5.push({ url: '/categories/entertainment', name: 'Entertainment' });
    links5.push({ url: '/categories/other', name: 'Other' });

    let navCategories = React.createElement(DropDown, { name: 'Categories', links: links5 });

    return (
      <ul className="nav navbar-nav">

        {navCategories}       


        {userId ? navAdmin : null}

      </ul>
    );
  }

};
