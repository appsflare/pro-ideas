import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import Select from 'react-select';
import { createContainer } from 'meteor/react-meteor-data';

class UserPickerComponent extends Component {
    constructor() {
        super(...arguments)
        this._setInitialState();
        this.memberSelected = this.memberSelected.bind(this);
    }

    _setInitialState() {
        this.state = {
            members: []
        };
    }

    memberSelected(members) {
        this.setState({ members });
        this.props.onChange && this.props.onChange(members.map(member => member.value));
    }

    render() {
        const members = this.props.members.map(user => {
            return {
                label: user.profile.fullName,
                value: user._id
            }
        })
        this.state.members = this.props.value || [];
        return <Select name="form-field-name"
            multi
            value={this.state.members}
            disabled={this.props.disabled}
            options={members}
            placeholder={this.props.placeholder || 'Pick an user'}
            onChange={this.memberSelected}
            />
    }
}


UserPickerComponent.propTypes = {
    loading: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.array,
    membersExists: PropTypes.bool.isRequired,
    multi: PropTypes.bool.isRequired,
    members: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

export default createContainer(({multi,disabled,value, placeholder, onChange}) => {    
    const allUsersHandle = Meteor.subscribe('account.allusers');
    const loading = !allUsersHandle.ready();
    const members = Meteor.users.find({}).fetch();
    const membersExists = !loading && !!members;
    return {
        multi,
        disabled,
        value,
        placeholder,
        onChange,
        loading,
        members,
        membersExists
    };
}, UserPickerComponent);