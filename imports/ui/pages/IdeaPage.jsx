
import { IdeaComments } from '../../api/idea-comments/idea-comments';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

import {Grid, Row, Col, Well, ButtonGroup} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Ideas } from '../../api/ideas/ideas';
import { update } from '../../api/ideas/methods';
import {TeamDisplay} from '../components/teams/TeamDisplay.jsx';
import SprintRoadMap from '../components/sprints/SprintRoadMap.jsx';
import {VoteIdea} from '../components/VoteIdea.jsx';
import {MarkIdeaAsCompleted} from '../components/MarkIdeaAsCompleted.jsx';

import IdeaCommentsListContainer from '../containers/IdeaCommentsListContainer.jsx';
import {IdeaCommentForm} from '../components/IdeaCommentForm.jsx';
import {ViewKanbanBoardButton} from '../components/kanban/ViewKanbanBoardButton.jsx';


import InlineEdit from 'react-edit-inline';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor'
import textUtils from '../helpers/text'
import './IdeaPage.scss'

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
        <div className="page-header">
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
          <ButtonGroup className="btn-group-raised">
            {this._renderVoteControls(idea) }
          </ButtonGroup>
          {<MarkIdeaAsCompleted className="pull-right hidden" idea={idea}/>}
          {this.currentUser? <ViewKanbanBoardButton className="pull-right" ideaId={idea._id}/>:''}
        </div>

        <div className="idea-details-container">

          <Grid className="idea-details-content-container">
            <Row className="show-grid">
              <Col md={8} className="idea-details-contents">
                <div className="idea-details-content">
                  <h4 className="idea-detail-heading upper-case bottom-border">Business value</h4>
                  { isCurrentUserTheOwner ?
                    <ReactMarkdownMediumEditor ref="businessValue"
                      options={{ placeholder: { text: 'Click here to describe Business value' } }}
                      markdown={idea.businessValue}
                      onChange={this.businessValueUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.businessValue || 'Nothing defined yet!') }/>
                  }
                </div>
                <div className="idea-details-content">
                  <h4 className="idea-detail-heading upper-case bottom-border">Definition of Success</h4>
                  { isCurrentUserTheOwner ?
                    <ReactMarkdownMediumEditor ref="definitionOfSuccess"
                      options={{ placeholder: { text: 'Click here to describe Definition of Success' } }}
                      markdown={idea.definitionOfSuccess}
                      onChange={this.definitionOfSuccessUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.definitionOfSuccess || 'Nothing defined yet!') }/>
                  }
                </div>
                <div className="idea-details-content">
                  <h4 className="idea-detail-heading upper-case bottom-border">Funding Requirement</h4>

                  { isCurrentUserTheOwner ? <ReactMarkdownMediumEditor ref="fundingRequirement"
                    options={{ placeholder: { text: 'Click here to Explain your fuding requirement in detail' } }}
                    markdown={idea.fundingRequirement}
                    onChange={this.fundingRequirementUpdated}/>
                    :
                    <div dangerouslySetInnerHTML={textUtils.createMarkup(idea.fundingRequirement || 'Nothing defined yet!') }/>
                  }
                </div>
              </Col>
              <Col md={4} className="idea-details-contents">
                <div>
                  <TeamDisplay multi={true} idea={idea}/>
                </div>
              </Col>
            </Row>
            {team ?
              <Row className="show-grid hidden">
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