import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {update} from '../../../api/sprints/methods';
import uuid from 'uuid';
import InlineEdit from 'react-edit-inline';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


export class EditSprintForm extends Component {

  constructor() {
    super(...arguments);
    this._setInitialState();
    
    this.onInputChange = this.onInputChange.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this._updateSprint = _.debounce(this._updateSprint.bind(this), 1000)
  }

  _setInitialState() {
    this.state = {
      error: '',
      name: '',
      goals: []
    };
  }


  _updateSprint(data) {
    data.sprintId = this.props.sprint._id;
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
    this._updateSprint(data)
  }

  handleSubmit(event) {
    event.preventDefault();

    const sprintInfo = {
      name: this.state.name.trim(),
      members: this.state.goals,
      sprintId: this.props.sprintId
    };

    this._updateSprint(sprintInfo);

  }  



  get currentUser() {
    return Meteor.userId();
  }

  componentDidMount() {

  }

  render() {
    const {error} = this.state;

    const {sprint} = this.props;
    

    this.state.name = sprint.name;
    this.state.goals = sprint.goals;


    const isCurrentUserTheOwner = this.currentUser === sprint.ownerId;


    return (
      <div ref="formContainer">

        {error ?
          <div className="alert alert-danger" role="alert">
            {error}
          </div> : ''}

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
          <div className="form-group">
            <div className="col-sm-12">
              <h4>
                { isCurrentUserTheOwner ?
                  (<InlineEdit
                    text={this.state.name}
                    validate={this.validate}
                    change={this.dataChanged}
                    paramName="name" />)
                  :
                  <span>{sprint.name}</span>
                }
              </h4>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              
            </div>
          </div>
        </form>
      </div>
    );
  }
}

EditSprintForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  sprint: PropTypes.object.isRequired
};

