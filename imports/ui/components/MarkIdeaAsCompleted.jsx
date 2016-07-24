import React, { Component, PropTypes } from 'react';
import {markAsCompleted} from '../../api/ideas/methods'

export class MarkIdeaAsCompleted extends Component {
    markAsCompleted(isUpVote) {
        this.currentUser && markAsCompleted.call({ ideaId: this.props.idea._id }, err => {

        });
    }



    get currentUser() {
        return Meteor.userId();
    }


    _renderControl(idea) {
        return (<span> <button className="btn btn-raised btn-success" onClick={this.markAsCompleted.bind(this, true) }>
            <i className="material-icons">done</i>
            <span> Mark As Done</span>
        </button>
        </span>);
    }

    render() {
        const {idea} = this.props;

        return (!idea.isCompleted() && idea.editableBy(this.currentUser)) ? this._renderControl(idea) : <span></span>;
    }
}


MarkIdeaAsCompleted.propTypes = {
    // This component gets the idea to display through a React prop.
    // We can use propTypes to indicate it is required
    idea: PropTypes.object.isRequired
};