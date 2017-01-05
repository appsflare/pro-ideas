import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Grid, Row, Col, Well, ButtonGroup } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { getFollowersCount, getFollowingCount } from '../../api/followers/methods';
import { update } from '../../api/profiles/methods';

import IdeaCommentsListContainer from '../containers/IdeaCommentsListContainer.jsx';
import { IdeaCommentForm } from '../components/IdeaCommentForm.jsx';
import { ViewKanbanBoardButton } from '../components/kanban/ViewKanbanBoardButton.jsx';


import InlineEdit from 'react-edit-inline';
import ReactMarkdownMediumEditor from 'meteor/universe:react-markdown-wysiwyg/ReactMarkdownMediumEditor';
import textUtils from '../helpers/text';


export class ProfilePage extends Component {


    constructor() {
        super(...arguments)
        this.state = {};
        this.dataChanged = this.dataChanged.bind(this);

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

    renderProfileDetails({profile, user}) {
        this.state = { profile, user };

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
                                <img className="profile-user-img img-responsive img-circle" src="../../dist/img/user4-128x128.jpg" alt="User profile picture" />
                                <h3 className="profile-username text-center">{user.profile.fullName}</h3>
                                <p className="text-muted text-center">Software Engineer</p>
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
                                {isCurrentUserTheOwner ? '' : <a href="#" className="btn btn-primary btn-block"><b>Follow</b></a>}
                            </div>
                            {/* /.box-body */}
                        </div>
                        {/* /.box */}
                        {/* About Me Box */}
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">About Me</h3>
                            </div>
                            {/* /.box-header */}
                            <div className="box-body">
                                <strong><i className="fa fa-book margin-r-5" /> Education</strong>
                                <p className="text-muted">
                                    B.S. in Computer Science from the University of Tennessee at Knoxville
                </p>
                                <hr />
                                <strong><i className="fa fa-map-marker margin-r-5" /> Location</strong>
                                <p className="text-muted">Malibu, California</p>
                                <hr />                                
                            </div>
                            {/* /.box-body */}
                        </div>
                        {/* /.box */}
                    </div>
                    {/* /.col */}
                    <div className="col-md-9">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className><a href="#activity" data-toggle="tab" aria-expanded="false">Activity</a></li>
                                <li className="active"><a href="#timeline" data-toggle="tab" aria-expanded="true">Timeline</a></li>
                                <li><a href="#settings" data-toggle="tab">Settings</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane" id="activity">
                                    {/* Post */}
                                    <div className="post">
                                        <div className="user-block">
                                            <img className="img-circle img-bordered-sm" src="../../dist/img/user1-128x128.jpg" alt="user image" />
                                            <span className="username">
                                                <a href="#">Jonathan Burke Jr.</a>
                                                <a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a>
                                            </span>
                                            <span className="description">Shared publicly - 7:30 PM today</span>
                                        </div>
                                        {/* /.user-block */}
                                        <p>
                                            Lorem ipsum represents a long-held tradition for designers,
                      typographers and the like. Some people hate it and argue for
                      its demise, but others ignore the hate as they create awesome
                      tools to help create filler text for everyone from bacon lovers
                      to Charlie Sheen fans.
                    </p>
                                        <ul className="list-inline">
                                            <li><a href="#" className="link-black text-sm"><i className="fa fa-share margin-r-5" /> Share</a></li>
                                            <li><a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5" /> Like</a>
                                            </li>
                                            <li className="pull-right">
                                                <a href="#" className="link-black text-sm"><i className="fa fa-comments-o margin-r-5" /> Comments
                          (5)</a></li>
                                        </ul>
                                        <input className="form-control input-sm" type="text" placeholder="Type a comment" />
                                    </div>
                                    {/* /.post */}
                                    {/* Post */}
                                    <div className="post clearfix">
                                        <div className="user-block">
                                            <img className="img-circle img-bordered-sm" src="../../dist/img/user7-128x128.jpg" alt="User Image" />
                                            <span className="username">
                                                <a href="#">Sarah Ross</a>
                                                <a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a>
                                            </span>
                                            <span className="description">Sent you a message - 3 days ago</span>
                                        </div>
                                        {/* /.user-block */}
                                        <p>
                                            Lorem ipsum represents a long-held tradition for designers,
                      typographers and the like. Some people hate it and argue for
                      its demise, but others ignore the hate as they create awesome
                      tools to help create filler text for everyone from bacon lovers
                      to Charlie Sheen fans.
                    </p>
                                        <form className="form-horizontal">
                                            <div className="form-group margin-bottom-none">
                                                <div className="col-sm-9">
                                                    <input className="form-control input-sm" placeholder="Response" />
                                                </div>
                                                <div className="col-sm-3">
                                                    <button type="submit" className="btn btn-danger pull-right btn-block btn-sm">Send</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/* /.post */}
                                    {/* Post */}
                                    <div className="post">
                                        <div className="user-block">
                                            <img className="img-circle img-bordered-sm" src="../../dist/img/user6-128x128.jpg" alt="User Image" />
                                            <span className="username">
                                                <a href="#">Adam Jones</a>
                                                <a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a>
                                            </span>
                                            <span className="description">Posted 5 photos - 5 days ago</span>
                                        </div>
                                        {/* /.user-block */}
                                        <div className="row margin-bottom">
                                            <div className="col-sm-6">
                                                <img className="img-responsive" src="../../dist/img/photo1.png" alt="Photo" />
                                            </div>
                                            {/* /.col */}
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <img className="img-responsive" src="../../dist/img/photo2.png" alt="Photo" />
                                                        <br />
                                                        <img className="img-responsive" src="../../dist/img/photo3.jpg" alt="Photo" />
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-6">
                                                        <img className="img-responsive" src="../../dist/img/photo4.jpg" alt="Photo" />
                                                        <br />
                                                        <img className="img-responsive" src="../../dist/img/photo1.png" alt="Photo" />
                                                    </div>
                                                    {/* /.col */}
                                                </div>
                                                {/* /.row */}
                                            </div>
                                            {/* /.col */}
                                        </div>
                                        {/* /.row */}
                                        <ul className="list-inline">
                                            <li><a href="#" className="link-black text-sm"><i className="fa fa-share margin-r-5" /> Share</a></li>
                                            <li><a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5" /> Like</a>
                                            </li>
                                            <li className="pull-right">
                                                <a href="#" className="link-black text-sm"><i className="fa fa-comments-o margin-r-5" /> Comments
                          (5)</a></li>
                                        </ul>
                                        <input className="form-control input-sm" type="text" placeholder="Type a comment" />
                                    </div>
                                    {/* /.post */}
                                </div>
                                {/* /.tab-pane */}
                                <div className="tab-pane active" id="timeline">
                                    {/* The timeline */}
                                    <ul className="timeline timeline-inverse">
                                        {/* timeline time label */}
                                        <li className="time-label">
                                            <span className="bg-red">
                                                10 Feb. 2014
                      </span>
                                        </li>
                                        {/* /.timeline-label */}
                                        {/* timeline item */}
                                        <li>
                                            <i className="fa fa-envelope bg-blue" />
                                            <div className="timeline-item">
                                                <span className="time"><i className="fa fa-clock-o" /> 12:05</span>
                                                <h3 className="timeline-header"><a href="#">Support Team</a> sent you an email</h3>
                                                <div className="timeline-body">
                                                    Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles,
                          weebly ning heekya handango imeem plugg dopplr jibjab, movity
                          jajah plickers sifteo edmodo ifttt zimbra. Babblely odeo kaboodle
                          quora plaxo ideeli hulu weebly balihoo...
                        </div>
                                                <div className="timeline-footer">
                                                    <a className="btn btn-primary btn-xs">Read more</a>
                                                    <a className="btn btn-danger btn-xs">Delete</a>
                                                </div>
                                            </div>
                                        </li>
                                        {/* END timeline item */}
                                        {/* timeline item */}
                                        <li>
                                            <i className="fa fa-user bg-aqua" />
                                            <div className="timeline-item">
                                                <span className="time"><i className="fa fa-clock-o" /> 5 mins ago</span>
                                                <h3 className="timeline-header no-border"><a href="#">Sarah Young</a> accepted your friend request
                        </h3>
                                            </div>
                                        </li>
                                        {/* END timeline item */}
                                        {/* timeline item */}
                                        <li>
                                            <i className="fa fa-comments bg-yellow" />
                                            <div className="timeline-item">
                                                <span className="time"><i className="fa fa-clock-o" /> 27 mins ago</span>
                                                <h3 className="timeline-header"><a href="#">Jay White</a> commented on your post</h3>
                                                <div className="timeline-body">
                                                    Take me to your leader!
                          Switzerland is small and neutral!
                          We are more like Germany, ambitious and misunderstood!
                        </div>
                                                <div className="timeline-footer">
                                                    <a className="btn btn-warning btn-flat btn-xs">View comment</a>
                                                </div>
                                            </div>
                                        </li>
                                        {/* END timeline item */}
                                        {/* timeline time label */}
                                        <li className="time-label">
                                            <span className="bg-green">
                                                3 Jan. 2014
                      </span>
                                        </li>
                                        {/* /.timeline-label */}
                                        {/* timeline item */}
                                        <li>
                                            <i className="fa fa-camera bg-purple" />
                                            <div className="timeline-item">
                                                <span className="time"><i className="fa fa-clock-o" /> 2 days ago</span>
                                                <h3 className="timeline-header"><a href="#">Mina Lee</a> uploaded new photos</h3>
                                                <div className="timeline-body">
                                                    <img src="http://placehold.it/150x100" alt="..." className="margin" />
                                                    <img src="http://placehold.it/150x100" alt="..." className="margin" />
                                                    <img src="http://placehold.it/150x100" alt="..." className="margin" />
                                                    <img src="http://placehold.it/150x100" alt="..." className="margin" />
                                                </div>
                                            </div>
                                        </li>
                                        {/* END timeline item */}
                                        <li>
                                            <i className="fa fa-clock-o bg-gray" />
                                        </li>
                                    </ul>
                                </div>
                                {/* /.tab-pane */}
                                <div className="tab-pane" id="settings">
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-sm-2 control-label">Name</label>
                                            <div className="col-sm-10">
                                                <input type="email" className="form-control" id="inputName" placeholder="Name" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputEmail" className="col-sm-2 control-label">Email</label>
                                            <div className="col-sm-10">
                                                <input type="email" className="form-control" id="inputEmail" placeholder="Email" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-sm-2 control-label">Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="inputName" placeholder="Name" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputExperience" className="col-sm-2 control-label">Experience</label>
                                            <div className="col-sm-10">
                                                <textarea className="form-control" id="inputExperience" placeholder="Experience" defaultValue={""} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputSkills" className="col-sm-2 control-label">Skills</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="inputSkills" placeholder="Skills" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" /> I agree to the <a href="#">terms and conditions</a>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <button type="submit" className="btn btn-danger">Submit</button>
                                            </div>
                                        </div>
                                    </form>
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
    user: PropTypes.object.isRequired
};