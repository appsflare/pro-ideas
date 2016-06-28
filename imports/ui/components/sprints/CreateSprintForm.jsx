import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../../api/sprints/methods';
import uuid from 'uuid';
import DatePicker from 'react-bootstrap-date-picker';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'

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
    };
  }



  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  handleSubmit(event) {
    event.preventDefault();

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
        return;
      }

      // Clear form
      this._setInitialState();


    });

  }

  goalsUpdated(goals) {
    this.setState({ goals })
  }

  startDateSelected(startDate) {
    this.setState({ startDate: moment(startDate).toDate() });
  }

  endDateSelected(endDate) {
    this.setState({ endDate: moment(endDate).toDate() });
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
            <div className="form-control auto-height">
              <input type="text" name="name" value={this.state.name} onChange={this.onInputChange.bind(this) } ref="nameInput" className="form-control" placeholder="Name your sprint"/>
            </div>
          </div>
          <div className="form-group">
            <div className="form-control auto-height">
              <ReactMarkdownMediumEditor ref="goals"
                options={{ placeholder: { text: 'Click here to Explain your sprint goals in detail' } }}
                markdown={this.state.goals}
                onChange={this.goalsUpdated}/>
            </div>
          </div>

          <div className="form-group">
            <div className="form-control auto-height">
              <DatePicker ref="startDate"
                placeholder="Select sprint start date"
                value={ this.state.startDate}
                onChange={this.startDateSelected}/>
            </div>
          </div>

           <div className="form-group">
            <div className="form-control auto-height">
              <DatePicker ref="endDate"
                placeholder="Select sprint end date"
                value={this.state.endDate}
                onChange={this.endDateSelected}/>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">Create Sprint!</button>
            </div>
          </div>
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

