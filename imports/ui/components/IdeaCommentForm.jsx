import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { insert } from '../../api/idea-comments/methods';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import './IdeaCommentForm.scss';

export class IdeaCommentForm extends Component {

  constructor() {
    super(...arguments);
    this.commentTextUpdated = this.commentTextUpdated.bind(this)
    this.state = { text: '' }
  }

  commentTextUpdated() {
    this.setState({ text: this.refs.comment.value })
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.state.text.trim();

    insert.call({ ideaId: this.props.ideaId, text }, err => {
      err && console.error(err);      
      this.setState({ text: '' })
    });


  }

  get currentUser() {
    return Meteor.userId();
  }



  render() {
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <div className="input-group">
            <input type="text" onChange={this.commentTextUpdated} value={this.state.text} ref="comment" name="comment" placeholder="Comment" className="form-control" />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-primary btn-flat">Comment</button>
            </span>
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
