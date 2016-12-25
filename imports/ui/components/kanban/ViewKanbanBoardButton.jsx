import React, { Component, PropTypes } from 'react';
import { createKanbanBoard } from '../../../api/ideas/methods';
import { browserHistory } from 'react-router'



export class ViewKanbanBoardButton extends Component {

    static get propTypes() {
        return {
            ideaId: PropTypes.string.isRequired
        }
    };

    constructor() {
        super(...arguments)
        this._createKanbanBoard = this._createKanbanBoard.bind(this)
    }

    _createKanbanBoard() {
        const { ideaId } = this.props
        createKanbanBoard.call({ ideaId }, (err, result) => {
            if (err) {
                return console.error(err)
            }
            browserHistory.push(`/idea/${ideaId}/kanban`)
        })

    }

    render() {
        const { className } = this.props
        return <button className={`btn btn-success btn-flat ${className || ''}`} onClick={this._createKanbanBoard}>View kanban board</button>
    }
}