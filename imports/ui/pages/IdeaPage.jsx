import React, { Component, PropTypes } from 'react';
import {Grid, Row, Col, Well} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Ideas } from '../../api/ideas/ideas';
import { update } from '../../api/ideas/methods';
import {TeamDisplay} from '../components/teams/TeamDisplay.jsx';
import SprintRoadMap from '../components/sprints/SprintRoadMap.jsx';
import {VoteIdea} from '../components/VoteIdea.jsx';
import {MarkIdeaAsCompleted} from '../components/MarkIdeaAsCompleted.jsx';
import { IdeaComments } from '../../api/idea-comments/idea-comments';
import IdeaCommentsListContainer from '../containers/idea-comments-list-container.jsx';
import {IdeaCommentForm} from '../components/idea-comment-form.jsx';

import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import textUtils from '../helpers/text'
import './IdeaPage.less'

export class IdeaPage extends Component {


  constructor() {
    super(...arguments)
    this.state = {};
    this.dataChanged = this.dataChanged.bind(this)
    this.businessValueUpdated = _.debounce(this.businessValueUpdated.bind(this), 1000)
    this.definitionOfSuccessUpdated = _.debounce(this.definitionOfSuccessUpdated.bind(this), 1000)
    this.fundingRequirementUpdated = _.debounce(this.fundingRequirementUpdated.bind(this), 1000)
    window.ReactDOM = ReactDOM;
    window.ReactMarkdownMediumEditor = ReactMarkdownMediumEditor;
  }

  get currentUser() {
    return Meteor.userId();
  }

  castVote(isUpVote, idea) {
    idea && this.currentUser && Meteor.call('votes.cast', idea._id, isUpVote);
  }

  upVote() {
    this.castVote(true, idea);
  }

  downVote() {
    this.castVote(false, idea);
  }

  validate(text) {
    return (text.length > 0 && text.length < 256);
  }

  _updateIdea(data) {
    data.ideaId = this.state._id;
    update.call(data, err => {
      err && console.error(err)
    })
  }

  dataChanged(data) {
    this._updateIdea(data)
  }

  businessValueUpdated(data) {
    this._updateIdea({ businessValue: data })
  }

  definitionOfSuccessUpdated(data) {
    this._updateIdea({ definitionOfSuccess: data })
  }

  fundingRequirementUpdated(data) {
    this._updateIdea({ fundingRequirement: data })
  }

  _renderVoteControls(idea) {
    return (<VoteIdea idea={idea}/>);
  }

  renderIdeaDetails(idea, team) {
    this.state = idea;
    const isCurrentUserTheOwner = this.currentUser === idea.ownerId
    return (
      <div key={idea._id}>
        <div class="page-header">
          <h1>
            { isCurrentUserTheOwner ?
              (<InlineEdit
                text={this.state.name}
                validate={this.validate}
                change={this.dataChanged}
                paramName="name" />)
              :
              <span>{idea.name}</span>
            }

            <small> by {idea.ownerName}</small></h1>
          {this._renderVoteControls(idea) } 
          {<MarkIdeaAsCompleted idea={idea}/>}
        </div>

        <div className="idea-details-container">

          <Grid className="idea-details-content-container">
            <Row className="show-grid">
              <Col md={8}>
                <div className="bs-callout bs-callout-info">
                  <h4><span className="upper-case bottom-border">Business value</span></h4>
                  { isCurrentUserTheOwner ?
                    <ReactMarkdownMediumEditor ref="businessValue"
                      options={{ placeholder: { text: 'Click here to describe Business value' } }}
                      markdown={idea.businessValue}
                      onChange={this.businessValueUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue || 'Nothing defined yet!') }/>
                  }
                </div>
                <div className="bs-callout bs-callout-info">
                  <h4><span className="upper-case bottom-border">Definition of Success</span></h4>
                  { isCurrentUserTheOwner ?
                    <ReactMarkdownMediumEditor ref="definitionOfSuccess"
                      options={{ placeholder: { text: 'Click here to describe Definition of Success' } }}
                      markdown={idea.definitionOfSuccess}
                      onChange={this.definitionOfSuccessUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.definitionOfSuccess || 'Nothing defined yet!') }/>
                  }
                </div>
                <div className="bs-callout bs-callout-info">
                  <h4><span className="upper-case bottom-border">Funding Requirement</span></h4>

                  { isCurrentUserTheOwner ? <ReactMarkdownMediumEditor ref="fundingRequirement"
                    options={{ placeholder: { text: 'Click here to Explain your fuding requirement in detail' } }}
                    markdown={idea.fundingRequirement}
                    onChange={this.fundingRequirementUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.fundingRequirement || 'Nothing defined yet!') }/>
                  }
                </div>
              </Col>
              <Col md={4}>
                <Well>
                  <TeamDisplay multi={true} idea={idea}/>
                </Well>
              </Col>
            </Row>
            {team ?
              <Row className="show-grid">
                <Col md={12}>
                  <SprintRoadMap teamId={team._id}/>
                </Col>
              </Row>
              : ''}
            <Row className="show-grid">
              <Col md={12}>
                <h4>
                  <span className="upper-case bottom-border">Discussions  { idea.comments ? <span className="badge">{idea.comments}</span> : ''}
                  </span>
                </h4>
                <hr/>
                {this.currentUser ? <IdeaCommentForm ideaId={idea._id} /> : ''}
                <IdeaCommentsListContainer ideaId={idea._id}/>
              </Col>
            </Row>
          </Grid>
        </div>

      </div>
    );
  }

  renderIdea(idea, team) {
    return this.renderIdeaDetails(idea, team);
  }

  render() {
    return (
      <div className="container">
        {this.renderIdea(this.props.idea, this.props.team) }
      </div>
    );
  }
}



IdeaPage.propTypes = {
  idea: PropTypes.object.isRequired
};