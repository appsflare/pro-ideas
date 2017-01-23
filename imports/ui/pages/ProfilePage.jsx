import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Grid, Row, Col, Well, ButtonGroup } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { getFollowersCount, getFollowingCount, follow, unfollow, checkIfFollowing } from '../../api/followers/methods';
import { update } from '../../api/profiles/methods';

import IdeaCommentsListContainer from '../containers/IdeaCommentsListContainer.jsx';
import { IdeaCommentForm } from '../components/IdeaCommentForm.jsx';
import { ViewKanbanBoardButton } from '../components/kanban/ViewKanbanBoardButton.jsx';
import { ActivityTimeline } from '../components/activities/index';
import { ChangePasswordForm } from '../components/auth/change-password-form';


import InlineEdit from 'react-edit-inline';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor';
import textUtils from '../helpers/text';
import { Tracker } from 'meteor/tracker'


export class ProfilePage extends Component {


    constructor() {
        super(...arguments)
        this.state = { isFollowing: false };
        this.toggleFollow = this.toggleFollow.bind(this);
        this._handleToggleFollow = this._handleToggleFollow.bind(this);

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

    toggleFollow() {
        debugger;
        const {isFollowing} = this.state;
        const {profile} = this.props;

        const param = { uid: profile.ownerId };
        isFollowing ? unfollow.call(param, this._handleToggleFollow) : follow.call(param, this._handleToggleFollow)
    }

    _handleToggleFollow(err) {
        if (err) {
            console.error(err);
            return;
        }
        this._checkFollowStatus();
    }

    componentWillReceiveProps({profile}) {
        if (!profile) { return; }
        setTimeout(() => this._checkFollowStatus());
    }


    _checkFollowStatus() {
        const {profile} = this.props;
        if (!profile)
        { return; }
        checkIfFollowing.call({ uid: profile.ownerId }, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            this.setState({ isFollowing: result });
        });
    }

    renderProfileDetails({ profile, user, activityStreams, contributionStreams }) {
        const {isFollowing} = this.state;
        if (!profile)
        { return <div />; }

        const isCurrentUserTheOwner = this.currentUser === profile.ownerId
        return (

            <section className="content">
                <div className="row">
                    <div className="col-md-3">
                        {/* Profile Image */}
                        <div className="box box-primary">
                            <div className="box-body box-profile">
                                <img className="profile-user-img img-responsive img-circle" src={profile.profileImage} alt="User profile picture" />
                                <h3 className="profile-username text-center">{user.profile.fullName}</h3>
                                {/*<p className="text-muted text-center">Software Engineer</p>*/}
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Followers</b> <a className="pull-right">{profile.followersCount}</a>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Following</b> <a className="pull-right">{profile.followingCount}</a>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Ideas</b> <a className="pull-right">{profile.ideasCount}</a>
                                    </li>
                                </ul>
                                {isCurrentUserTheOwner || !this.currentUser ? '' : <button className="btn btn-primary btn-block" onClick={this.toggleFollow}><b>{isFollowing ? 'Following' : 'Follow'}</b></button>}
                            </div>
                            {/* /.box-body */}
                        </div>
                        {/* /.box */}
                    </div>
                    {/* /.col */}
                    <div className="col-md-9">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#activity" data-toggle="tab" aria-expanded="false">Contributions</a></li>
                                <li className><a href="#timeline" data-toggle="tab" aria-expanded="true">Timeline</a></li>
                                <li><a href="#settings" data-toggle="tab">Settings</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="activity">
                                    {contributionStreams && contributionStreams.length ? <ActivityTimeline activityStreams={contributionStreams} /> : 'No contributions made yet!!'}
                                </div>
                                {/* /.tab-pane */}
                                <div className="tab-pane" id="timeline">
                                    {activityStreams && activityStreams.length ? <ActivityTimeline activityStreams={activityStreams} /> : 'No Activities done yet!!'}
                                </div>
                                {/* /.tab-pane */}
                                <div className="tab-pane" id="settings">
                                    <ChangePasswordForm />
                                </div>
                                {/* /.tab-pane */}
                            </div>
                            {/* /.tab-content */}
                        </div>
                        {/* /.nav-tabs-custom */}
                    </div>
                    {/* /.col */}
                </div>
                {/* /.row */}
            </section>
        );
    }

    render() {
        return (
            <div className="container">
                {this.renderProfileDetails(this.props)}
            </div>
        );
    }
}



ProfilePage.propTypes = {
    profile: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    activityStreams: PropTypes.array.isRequired,
    contributionStreams: PropTypes.array.isRequired
};