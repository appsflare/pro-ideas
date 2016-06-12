import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

export class IdeaCommentForm extends Component {

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    let textInput = ReactDOM.findDOMNode(this.refs.textInput);

   let text = textInput.value.trim();

    Meteor.call('idea-comments.insert', this.props.ideaId, text);

    // Clear form
    textInput.value = '';
  }

  get currentUser() {
    return Meteor.userId();
  }



  render() {    
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >
       
          <div className="form-group">
            <div className="col-sm-12">
              <textarea ref="textInput" name="text" className="form-control" rows="3" placeholder=""></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">Comment</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


IdeaCommentForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  ideaId: PropTypes.string.isRequired
};
