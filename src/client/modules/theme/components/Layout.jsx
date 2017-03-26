import React from 'react';

import NavHeader from './NavHeader.jsx';

export default class extends React.Component {

  render() {

    // const content = _.get(this.props,'content', () => {});
    const {
      content
    } = this.props;

    return (
      <div id="app" className="fixed sidebar-collapse app-page">

        <NavHeader />

        <div className="wrapper">

          <div className="main">

            {content()}

          </div>
        </div>
      </div>
    );
  }
}
