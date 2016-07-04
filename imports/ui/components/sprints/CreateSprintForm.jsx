import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../../api/sprints/methods';
import uuid from 'uuid';
import DatePicker from 'react-bootstrap-date-picker';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'

function formateDate(date) {
  return moment(date).format('MM/DD/YYYY')
}

export class CreateSprintForm extends Component {

  constructor() {
    super(...arguments);
    this._setInitialState();
    this.startDateSelected = this.startDateSelected.bind(this);
    this.endDateSelected = this.endDateSelected.bind(this);
    this.goalsUpdated = this.goalsUpdated.bind(this)
  }

  _setInitialState() {
    const now = new Date()
    const nowPlus9 = now.setDate(now.getDate() + 9)
    this.state = {
      error: '',
      name: '',
      goals: '',
      startDate: now,
      endDate: nowPlus9,
      startDateStr: formateDate(now),
      endDateStr: formateDate(nowPlus9)
    };
  }



  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.save();
  }

  save() {
    return new Promise((resolve, reject) => {
      const newSprint = {
        name: this.state.name.trim(),
        goals: this.state.goals,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        teamId: this.props.teamId
      };

      insert.call(newSprint, err => {

        if (err) {
          this.setState({ error: err.reason });
          reject(err.reason);
          return;
        }

        // Clear form
        this._setInitialState();
        resolve(true);

      });
    });
  }

  goalsUpdated(goals) {
    this.setState({ goals })
  }

  startDateSelected(startDate) {
    this.setState({ startDate: moment(startDate).toDate(), startDateStr: startDate });
  }

  endDateSelected(endDate) {
    this.setState({ endDate: moment(endDate).toDate(), endDateStr: endDate });
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

        <form onSubmit={this.handleSubmit.bind(this) } >
          <FormGroup>
            <FormControl type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this) } placeholder="Name your sprint"/>
          </FormGroup>
          <FormGroup>
            <ReactMarkdownMediumEditor className="form-control auto-height" ref="goals"
              options={{ placeholder: { text: 'Click here to Explain your sprint goals in detail' } }}
              markdown={this.state.goals}
              onChange={this.goalsUpdated}/>
          </FormGroup>
          <FormGroup>
            <DatePicker className="form-control auto-height" ref="startDate"
              placeholder="Select sprint start date"
              value={ this.state.startDateStr}
              onChange={this.startDateSelected}/>
          </FormGroup>
          <FormGroup>
            <DatePicker className="form-control auto-height" ref="endDate"
              placeholder="Select sprint end date"
              value={this.state.endDateStr}
              onChange={this.endDateSelected}/>
          </FormGroup>
        </form>
      </div>
    );
  }
}

CreateSprintForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  teamId: PropTypes.string.isRequired
};

