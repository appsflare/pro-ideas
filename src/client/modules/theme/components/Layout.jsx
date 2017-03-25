import React from 'react';

import NavHeader from './NavHeader.jsx';

export default class extends React.Component {

  render() {

    // const content = _.get(this.props,'content', () => {});
    const {
      content
    } = this.props;

    return (
      <div id="app" className="skin-black fixed sidebar-collapse">

        <NavHeader />

        <div className="container">

          <div className="main main-raised">

            {content()}

          </div>
        </div>
      </div>
    );
  }
}
