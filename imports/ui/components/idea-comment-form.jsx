import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../api/idea-comments/methods';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'

export class IdeaCommentForm extends Component {

  constructor() {
    super(...arguments);
    this.commentTextUpdated = this.commentTextUpdated.bind(this)
    this.state = { text: '' }
  }

  commentTextUpdated(data) {
    this.setState({ text: data })
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.state.text.trim();

    insert.call({ ideaId: this.props.ideaId, text }, err => {
      err && console.error(err);
      this.refs.editor.medium.setContent('')
      this.setState({ text: '' })
    });


  }

  get currentUser() {
    return Meteor.userId();
  }



  render() {
    return (
      <div>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this) } >

          <div className="form-group">
            <div className="col-sm-10">
              <div className="form-control auto-height">
                <ReactMarkdownMediumEditor ref="editor"
                  options={{ placeholder: { text: 'Click here to add your comment' } }}
                  markdown={this.state.text}
                  onChange={this.commentTextUpdated}/>
              </div>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-raised btn-default">Comment</button>
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
