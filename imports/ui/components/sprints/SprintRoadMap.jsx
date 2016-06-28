import React, {PropTypes, Component} from 'react'
import {Button, Panel} from 'react-bootstrap'
import { createContainer } from 'meteor/react-meteor-data';
import Timeline from 'react-calendar-timeline'
import moment from 'moment'
import {Sprints} from '../../../api/sprints/sprints';
import {CreateSprintForm} from './CreateSprintForm.jsx';

const groups = [
    { id: 1, title: 'sprints' }
]

const items = [
    { id: 1, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour') },
    { id: 2, group: 1, title: 'item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour') },
    { id: 3, group: 1, title: 'item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour') }
]


class SprintRoadMapComponent extends Component {

    constructor() {
        super(...arguments)
        this.showAddForm = this.showAddForm.bind(this)
        this._setInitialState({
            isAddFormOpen: false,
            isEditFormOpen: false
        })
    }

    _setInitialState(state) {
        this.state = state;
    }

    _defaultItemFormatter({_id, name, goals,teamId, createdAt, status, startDate, endDate, ownerId}) {
        return { id: _id, group: 1, title: name, start_time: startDate.getTime(), end_time: endDate.getTime() }
    }

    _defaultGroupSelector(item) {
        return 1;
    }

    showAddForm() {
        this.setState({ isAddFormOpen: true, isEditFormOpen: false })
    }

    renderControls() {
        const {isAddFormOpen} = this.state;
        return (
            <div>
                <Button onClick={this.showAddForm}>Add Sprint</Button>
                <Panel collapsible expanded={this.state.isAddFormOpen}>
                    <CreateSprintForm teamId={this.props.teamId}/>
                </Panel>
            </div>)
    }

    render() {

        const itemFormatter = this.props.itemFormatter || this._defaultItemFormatter;
        const groupSelector = this.props.groupSelector || this._defaultGroupSelector;

        const {groups, items, loading} = this.props

        items.push({ id: 1, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour') })

        const finalItems = this.props.items.map(item => {
            const newItem = itemFormatter(item)

            newItem.group = groupSelector(item)

            return newItem
        })

        return <div>

            {loading ? 'Loading sprint data' :
                <div>
                    {this.renderControls() }
                    <Timeline groups={groups}
                        items={finalItems}
                        defaultTimeStart={moment().add(-12, 'hour') }
                        defaultTimeEnd={moment().add(12, 'hour') }
                        />
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

    return {
        loading,
        groups,
        items
    };
}, SprintRoadMapComponent)