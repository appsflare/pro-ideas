import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {update} from '../../../api/teams/methods';
import uuid from 'uuid';
import Select from 'react-select';
import UserPicker from '../UserPicker'
import InlineEdit from 'react-edit-inline';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


export class EditTeamForm extends Component {

  constructor() {
    super(...arguments);
    this._setInitialState();
    this.memberSelected = this.memberSelected.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this._updateTeam = _.debounce(this._updateTeam.bind(this), 1000)
  }

  _setInitialState() {
    this.state = {
      error: '',
      name: '',
      members: []
    };
  }


  _updateTeam(data) {
    data.teamId = this.props.team._id;
    update.call(data, error => {
      if (error) {
        this.setState({ error })
        return;
      }
      this._setInitialState(data)
    })
  }


  validate(text) {
    return (text.length > 0 && text.length < 256);
  }

  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  dataChanged(data) {
    this._updateTeam(data)
  }

  handleSubmit(event) {
    event.preventDefault();

    const teamInfo = {
      name: this.state.name.trim(),
      members: this.state.members.map(mem => {
        return { memberId: mem };
      }),
      ideaId: this.props.ideaId
    };

    this._updateTeam(teamInfo);

  }

  memberSelected(members) {
    this._updateTeam({
      members: members.map(mem => {
        return { memberId: mem };
      })
    })
  }



  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {

  }

  render() {
    const {error} = this.state;

    const {team} = this.props;
    const members = team.members.map(mem => mem.memberId);

    this.state.name = team.name;
    this.state.members = members;


    const isCurrentUserTheOwner = this.currentUser === team.ownerId;


    return (
      <div ref="formContainer">

        {error ?
          <div className="alert alert-danger" role="alert">
            {error}
          </div> : ''}

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-6">
              <h4>
                { isCurrentUserTheOwner ?
                  (<InlineEdit
                    text={this.state.name}
                    validate={this.validate}
                    change={this.dataChanged}
                    paramName="name" />)
                  :
                  <span>{team.name}</span>
                }
              </h4>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6">
              <UserPicker multi={true} value={members} disabled={!isCurrentUserTheOwner} onChange={this.memberSelected} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

EditTeamForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  team: PropTypes.object.isRequired
};

