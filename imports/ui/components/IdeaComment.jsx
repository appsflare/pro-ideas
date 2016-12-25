import React, { Component, PropTypes } from 'react';
import { remove, updateText } from '../../api/idea-comments/methods';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import textUtils from '../helpers/text'

// Task component - represents a single todo item
export default class IdeaComment extends Component {

  constructor() {
    super(...arguments)
    this.commentTextUpdated = _.debounce(this.commentTextUpdated.bind(this), 1000);
    this.state = { comment: { text: '' } }
  }

  commentTextUpdated(data) {
    updateText.call({ commentId: this.props.comment._id, text: data }, err => {
      err && console.error(err);
    });
  }

  deleteThisComment() {
    remove.call({ commentId: this.props.comment._id }, err => {
      err && console.error(err);
    });
  }

  get currentUser() {
    return Meteor.userId();
  }

  render() {
    const comment = this.props.comment;
    this.state.comment = comment;
    const isCurrentUserTheOwner = comment.ownerId === this.currentUser;
    return (
      <div className="direct-chat-msg">
        <div className="direct-chat-info clearfix">
          <span className="direct-chat-name pull-left">{comment.ownerName}</span>
           {isCurrentUserTheOwner ?
            <button type="button" className="close pull-right" aria-label="Close" onClick={this.deleteThisComment.bind(this)}>
              <span aria-hidden="true">&times; </span>
            </button>
            : ''
          }
          <span className="direct-chat-timestamp pull-right">
            {comment.updatedOn ?
              <small> {moment(comment.updatedOn).fromNow()}</small>
              :
              <small> {moment(comment.createdAt).fromNow()}</small>
            }
          </span>

        </div>
        {/*<img className="direct-chat-img" src="../dist/img/user1-128x128.jpg" alt="message user image" />*/}
        <div className="direct-chat-text">
          {isCurrentUserTheOwner ? <ReactMarkdownMediumEditor
            options={{ placeholder: { text: 'Click here to add your comment' } }}
            markdown={this.state.comment.text || ''}
            onChange={this.commentTextUpdated} />
            :
            <div dangerouslySetInnerHTML={textUtils.createMarkup(this.state.comment.text)} />
          }
        </div>
      </div>
    );
  }
}

IdeaComment.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  comment: PropTypes.object.isRequired
};
