import React from 'react';

import NavHeaderBrand from '/client/modules/app/components/Theme/NavHeaderBrand.jsx';


export default class extends React.Component {

  render() {

    // const content = _.get(this.props,'content', () => {});
    const {
      content
    } = this.props;

    return (
      <div className="signup-page">

        <nav className="navbar navbar-transparent navbar-absolute">
          <div className="container">
            {/* Brand and toggle get grouped for better mobile display */}
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand logo" href="/"><NavHeaderBrand /></a>
            </div>
            <div className="collapse navbar-collapse" id="navigation-example">
              <ul className="nav navbar-nav navbar-right">
                
                <li>
                  <a href="/login" target="_blank">
                    <i className="material-icons">lock</i> Login
                </a>
                </li>
                <li>
                  <a href="https://twitter.com/CreativeTim" target="_blank" className="btn btn-simple btn-white btn-just-icon">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/CreativeTim" target="_blank" className="btn btn-simple btn-white btn-just-icon">
                    <i className="fa fa-facebook-square" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/CreativeTimOfficial" target="_blank" className="btn btn-simple btn-white btn-just-icon">
                    <i className="fa fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="wrapper">
          <div className="header header-filter" style={{
            backgroundImage: `url('../assets/img/city.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center'
          }}>
            <div className="container">
              {content()}
            </div>

          </div>
        </div>
      </div >
    );
  }
}
