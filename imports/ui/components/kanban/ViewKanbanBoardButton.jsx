import React, { Component, PropTypes } from 'react';
import { createKanbanBoard } from '../../../api/ideas/methods';
import { browserHistory } from 'react-router'



export class ViewKanbanBoardButton extends Component {

    static get propTypes() {
        return {
            isCurrentUserTheOwner: PropTypes.bool.isRequired,
            isCreated: PropTypes.bool.isRequired,
            ideaId: PropTypes.string.isRequired
        }
    };

    constructor() {
        super(...arguments)
        this._createKanbanBoard = this._createKanbanBoard.bind(this)
    }

    _createKanbanBoard() {
        const { ideaId, isCreated, isCurrentUserTheOwner } = this.props

        if (isCreated) {
            browserHistory.push(`/idea/${ideaId}/tasks`);
            return;
        }

        if (!isCurrentUserTheOwner)
        { return; }

        createKanbanBoard.call({ ideaId }, (err, result) => {
            if (err) {
                return console.error(err)
            }
            browserHistory.push(`/idea/${ideaId}/tasks`)
        });

    }

    render() {
        const { className, isCreated, isCurrentUserTheOwner } = this.props
        return isCurrentUserTheOwner ? <button className={`btn btn-success btn-flat ${className || ''}`} onClick={this._createKanbanBoard}>View Tasks</button> : <span />;
    }
}