import React, { Component, PropTypes } from 'react';
import {CardPanel, Card, Button, Icon} from 'react-materialize';

import {remove, updateText} from '../../api/idea-comments/methods';
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

      <Card>
        <div className="panel-heading">
          {comment.ownerName}

          {comment.updatedOn ?
            <small> commented {moment(comment.updatedOn).fromNow() }</small>
            :
            <small> commented {moment(comment.createdAt).fromNow() }</small>
          }

          {isCurrentUserTheOwner ?
            <Button className="right close" onClick={this.deleteThisComment.bind(this) }>
              <Icon>delete</Icon>
            </Button>
            : ''
          }
        </div>

        { isCurrentUserTheOwner ? <ReactMarkdownMediumEditor
          options={{ placeholder: { text: 'Click here to add your comment' } }}
          markdown={this.state.comment.text || '' }
          onChange={this.commentTextUpdated}/>
          :
          <div dangerouslySetInnerHTML={textUtils.createMarkup(this.state.comment.text) }/>
        }
      </Card>
    );
  }
}

IdeaComment.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  comment: PropTypes.object.isRequired
};
