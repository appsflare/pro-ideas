import './App.scss';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import 'admin-lte/dist/js/app.js';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
import { Ideas } from '../../api/ideas/ideas.js';
import UserMenu from '../components/UserMenu.jsx';
import ConnectionNotification from '../components/ConnectionNotification';
import Loading from '../components/Loading.jsx';
import IdeasContainer from '../containers/IdeasContainer.jsx';

const CONNECTION_ISSUE_TIMEOUT = 50000;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showConnectionIssue: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {
    if (!this.currentUser) {
      this.context.router.push('/auth/signin');
      return;
    }
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {
    // redirect / to a list once lists are ready
    // if (!loading && !children) {
    //   const list = Ideas.findOne();
    //   this.context.router.replace('/ideas');
    // }
  }

  toggleMenu(menuOpen = !Session.get('menuOpen')) {
    Session.set({ menuOpen });
  }

  logout() {
    Meteor.logout();

    this.context.router.push('/');


  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      ideas,
      menuOpen,
      children,
      location,
    } = this.props;

    const closeMenu = this.toggleMenu.bind(this, false);


    showConnectionIssue && !connected ? ConnectionNotification.notify() : ConnectionNotification.close();

    // clone route components with keys so that they can
    // have transitions   

    const clonedChildren = React.cloneElement(children || <IdeasContainer route={{ params: { all: true } }} />, {
      key: location.pathname,
    });

    return (

      <div className="wrapper">
        <header className="main-header">
          <a href="/" className="logo"><img src="/icons/logo_white.png"/></a>
          <Navbar staticTop>
            <Nav>
              <NavItem eventKey={1} href="/ideas">Ideas</NavItem>
            </Nav>
            <Nav pullRight>
              <UserMenu user={user} logout={this.logout} />
            </Nav>
          </Navbar>

        </header>
        <section className="container">
          {this.props.content}
        </section>
        <div id="container" className={menuOpen ? 'content-wrapper menu-open' : 'content-wrapper'}>
          <section id="menu">

          </section>
          <div className="content-overlay" onClick={closeMenu}></div>
          <section className="content" id="content-container">
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
              >
              {loading
                ? <Loading key="loading" />
                : clonedChildren}
            </ReactCSSTransitionGroup>
          </section>
        </div>
        <footer>
          {this.props.footer || ''}
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  menuOpen: React.PropTypes.bool,    // is side menu open?
  ideas: React.PropTypes.array,      // all lists visible to the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};
