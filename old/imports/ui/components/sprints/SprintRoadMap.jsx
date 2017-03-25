import React, {PropTypes, Component} from 'react'
import {ButtonToolbar, Button, Overlay, Modal} from 'react-bootstrap'
import { createContainer } from 'meteor/react-meteor-data';
import Timeline from 'react-calendar-timeline'
import moment from 'moment'
import {Sprints} from '../../../api/sprints/sprints';
import {CreateSprintForm} from './CreateSprintForm.jsx';
import {EditSprintForm} from './EditSprintForm.jsx';
import './SprintRoadMap.scss'

const items = [
    { id: 1, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour') },
    { id: 2, group: 1, title: 'item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour') },
    { id: 3, group: 1, title: 'item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour') }
]

let counter = 0;


class SprintRoadMapComponent extends Component {

    constructor() {
        super(...arguments)
        this.showAddForm = this.showAddForm.bind(this)
        this._defaultItemFormatter = this._defaultItemFormatter.bind(this)
        this._defaultGroupSelector = this._defaultGroupSelector.bind(this)
        this._setInitialState({
            isAddFormOpen: false,
            isEditFormOpen: false,
            itemBeingEdited: null,
            isSprintCreateInProgress: false,
            target: null
        })
    }

    _setInitialState(state) {
        this.state = state;
    }

    _defaultItemFormatter({_id, name, goals, teamId, createdAt, status, startDate, endDate, ownerId}) {

        return { id: _id, group: 1, title: status || 'created', sprintName: name, start_time: startDate.getTime(), end_time: endDate.getTime() }

    }

    _defaultGroupSelector(item) {
        return item.name;
    }

    showAddForm(e) {
        this.setState({ isAddFormOpen: true, isEditFormOpen: false, target: e.target })
    }

    createSprint(e) {
        this.setState({ isSprintCreateInProgress: true })
        this.refs.createSprintForm.save()
            .then(res => {
                this.setState({ isAddFormOpen: false, isSprintCreateInProgress: false })
            }).catch(e => {
                this.setState({ isSprintCreateInProgress: false })
            });
    }

    renderControls() {
        const {isAddFormOpen} = this.state;
        return (
            <ButtonToolbar>
                <Button bsStyle="default" className="btn-raised" onClick={this.showAddForm}>
                    Add Sprint
                </Button>
                <Modal
                    show={this.state.isAddFormOpen}
                    container={this}
                    aria-labelledby="create-sprint-title"
                    onHide={(e) => { this.setState({ isAddFormOpen: false }) } }
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="create-sprint-title">Create New Sprint</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.isAddFormOpen ?
                            <CreateSprintForm ref="createSprintForm" teamId={this.props.teamId}/> : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={this.state.isSprintCreateInProgress} onClick={(e) => this.createSprint(e) }
                            bsStyle="primary">Create Sprint!</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.isEditFormOpen}
                    aria-labelledby="edit-sprint-title"
                    onHide={(e) => { this.setState({ isEditFormOpen: false }) } }
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="edit-sprint-title">Edit Sprint</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.isEditFormOpen ?
                            <EditSprintForm ref="editSprintForm" sprint={this.state.itemBeingEdited}/> : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={this.state.isSprintCreateInProgress} onClick={(e) => this.createSprint(e) }
                            bsStyle="primary">Save Changes!</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>



        )
    }

    onItemDoubleClick(itemId) {
        const item = _.findWhere(this.props.items, { _id: itemId });
        if (!item) { return; }
        this.setState({ isEditFormOpen: true, itemBeingEdited: item });
    }

    render() {

        const itemFormatter = this.props.itemFormatter || this._defaultItemFormatter;
        const groupSelector = this.props.groupSelector || this._defaultGroupSelector;

        const {groups, items, loading} = this.props



        const finalItems = this.props.items.map(item => {
            let newItem = itemFormatter(item)

            newItem.group = groupSelector(item)

            return newItem
        })

        //finalItems.push({ id: 10, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour') })

        return <div>

            {loading ? 'Loading sprint data' :
                <div>
                    {this.renderControls() }
                    {finalItems.length ?
                        <Timeline groups={groups}
                            items={finalItems}
                            defaultTimeStart={moment().add(-15, 'day') }
                            defaultTimeEnd={moment().add(15, 'day') }
                            onItemDoubleClick={this.onItemDoubleClick.bind(this) }
                            />
                        : 'No Sprints have been created yet!'}
                </div>
            }
        </div>

    }
}

SprintRoadMapComponent.propTypes = {
    teamId: PropTypes.string,
    groups: PropTypes.array,
    items: PropTypes.array.isRequired,
    itemFormatter: PropTypes.func,
    groupSelector: PropTypes.func
}

export default createContainer(({teamId}) => {

    const teamSprintsHandle = Meteor.subscribe('sprints.forTeam', teamId);
    const loading = !teamSprintsHandle.ready();
    const items = Sprints.find({ teamId }).fetch();

    const grouped = _.groupBy(items, item => item.name)

    const groups = _.map(grouped, (value, key) => {
        return { id: key, title: key }
    })

    return {
        loading,
        groups,
        items
    };
}, SprintRoadMapComponent)