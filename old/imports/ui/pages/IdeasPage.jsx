import React, { Component, PropTypes } from 'react';
import CreateIdeaForm from '../components/CreateIdeaForm';
import { Ideas } from '../../api/ideas/ideas';
import { IdeasList } from '../components/IdeasList';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import Message from '../components/Message.jsx';

export class IdeasPage extends Component {



  get currentUser() {
    return Meteor.userId();
  }

  renderIdeasList(ideas) {
    return ideas.length ?
      <IdeasList ideas={this.props.ideas} /> :
      (<Message title="No ideas yet!!" subtitle="That's hard to hear!!!" />);
  }

  componentDidMount() {
    $(this.createIdeaBox).activateBox();
  }

  render() {
    const {ideas} = this.props;
    return (
      <div className="container">
        <div ref="createIdeaBox" className="box box-solid box-default">
          <div className="box-header with-border">
            <h3 className="box-title">Have an idea flashing in your head?</h3>
            <div className="box-tools pull-right">
              <button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
            </div>
          </div>
          <div className="box-body">
            {this.currentUser ? <CreateIdeaForm /> : 'Please login to start posting ideas!!!'}
          </div>
        </div>
        {this.renderIdeasList(ideas)}
      </div>
    );
  }
}

IdeasPage.propTypes = {
  ideas: PropTypes.array.isRequired
};