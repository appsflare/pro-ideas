import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'react-materialize';
import {Meteor} from 'meteor/meteor';
import {insert} from '../../api/idea-comments/methods';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import './IdeaCommentForm.scss';

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
      <Row>
        <form onSubmit={this.handleSubmit.bind(this) }>
          <Col s="10" className="comment-box-container">
            <div className="input-field">
              <ReactMarkdownMediumEditor className="md-editor" ref="editor"
                options={{ placeholder: { text: 'Click here to add your comment' } }}
                markdown={this.state.text}
                onChange={this.commentTextUpdated}/>
            </div>

            <div className="col-sm-2">
              <button type="submit" className="btn btn-raised btn-default">Comment</button>
            </div>
          </Col>
        </form>
      </Row>
    );
  }
}


IdeaCommentForm.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  ideaId: PropTypes.string.isRequired
};
