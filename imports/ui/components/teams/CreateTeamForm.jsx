import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../api/teams/methods';
import uuid from 'uuid';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'


export default class CreateTeamForm extends Component {

  constructor() {
    super(...arguments);
    this._setInitialState();
  }

  _setInitialState() {
    this.state = {
      name: '',
      members: []
    };
  }



  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  handleSubmit(event) {
    event.preventDefault();

    const newTeam = {
      name: this.state.name.trim(),
      members: []      
    };


    insert.call(newTeam, err => {

      if (err) {
        this.setState({ error: err.reason });
      }

      // Clear form
      this._setInitialState();


    });

  }



  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {
    
  }

  render() {
    let panelId = `panel-${uuid.v1()}`,
      panelSel = `#${panelId}`,
      {error} = this.state;

    return (
      <div ref="formContainer">

        {error ?
          <div className="alert alert-danger" role="alert">
            {error}
          </div> : ''}

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <input type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this) } ref="nameInput" className="form-control" placeholder="Name your team"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <div className="form-control">

                
              </div>
            </div>
          </div>          
          
          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">Create Team!</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CreateTeamForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  ideaId: PropTypes.object.isRequired
};

