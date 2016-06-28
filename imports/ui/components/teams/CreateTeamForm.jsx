import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../../api/teams/methods';
import uuid from 'uuid';
import Select from 'react-select';
import UserPicker from '../UserPicker'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


export class CreateTeamForm extends Component {

  constructor() {
    super(...arguments);
    this._setInitialState();
    this.memberSelected = this.memberSelected.bind(this);
  }

  _setInitialState() {
    this.state = {
      error:'',
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
      members: this.state.members.map(mem => {
        return { memberId: mem };
      }),
      ideaId: this.props.ideaId
    };    

    insert.call(newTeam, err => {

      if (err) {
        this.setState({ error: err.reason });
        return;
      }

      // Clear form
      this._setInitialState();


    });

  }

  memberSelected(members) {
    this.setState({ members });
  }



  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {

  }

  render() {
    let {members, error} = this.state;



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
              <UserPicker multi={true} value={members} onChange={this.memberSelected} />
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
  ideaId: PropTypes.string.isRequired
};

