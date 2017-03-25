import React from 'react';

export default class ChangePasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPasswrod: '',
      error: ''
    };
    this.changePassword = this.changePassword.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }


  onInputChange(e) {
    let partialState = {};
    partialState[e.target.name] = e.target.value;
    this.setState(partialState);
  }

  changePassword(event) {
    event.preventDefault();
    Accounts.changePassword(this.state.currentPassword, this.state.newPasswrod, err => {
      if (err) {
        this.setState({ error: err });
        return;
      }
    })

  }

  render() {
    return <div className="container">
      <form className="form-horizontal" onSubmit={this.changePassword.bind(this) } >
        <div className="form-group">
          <div className="col-sm-6">
            <input type="password" required name="currentPassword" value={this.state.currentPassword} onChange={this.onInputChange.bind(this) } className="form-control" placeholder="Current Password"/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-6">
            <input type="password" required name="newPasswrod" value={this.state.newPasswrod} onChange={this.onInputChange.bind(this) } className="form-control" placeholder="New Password"/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-6">
            <button type="submit" className="btn btn-raised btn-primary">Change Password</button>
          </div>
        </div>
      </form>
    </div>
  }
}
