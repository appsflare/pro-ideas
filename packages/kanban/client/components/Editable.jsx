import React, { PropTypes } from 'react';

export default class Editable extends React.Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleValueClick = this.handleValueClick.bind(this);
    this.handleFinishEdit = this.handleFinishEdit.bind(this);
    this.selectToEnd = this.selectToEnd.bind(this);
    this.state = { editing: false };
  }

  handleDelete() {
    this.props.onDelete(this.props.id);
  }

  handleValueClick() {
    //this.props.onValueClick(this.props.id);
    this.setState({ editing: true });
  }

  handleFinishEdit(e) {
    if ((e.type === 'keypress') && (e.key !== 'Enter')) {
      return;
    }

    const value = e.target.value;

    if (this.props.onEdit && value.trim().length) {
      this.setState({ editing: false });
      this.props.onEdit(this.props.id, value);
    }
  }

  selectToEnd(input) {
    if (input) {
      input.selectionEnd = this.props.value.length;
    }
  }

  renderEdit() {
    return (
      <input
        type="text"
        autoFocus
        className="editing"
        ref={this.selectToEnd}
        defaultValue={this.props.value}
        onBlur={this.handleFinishEdit}
        onKeyPress={this.handleFinishEdit}
        />
    );
  }

  renderDelete() {
    return (
      <span className="delete" onClick={this.handleDelete}>
        &times;
      </span>
    );
  }

  renderValue() {
    return (
      <span>
        <span onClick={this.handleValueClick}>{this.props.value}</span>
        {this.props.onDelete ? this.renderDelete() : null}
      </span>
    );
  }

  render() {
    if (this.state.editing) {
      return this.renderEdit();
    }

    return this.renderValue();
  }
}

Editable.propTypes = {
  editing: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func.isRequired,
  onValueClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
