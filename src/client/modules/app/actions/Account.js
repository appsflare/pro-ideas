
export default {

  login({ Meteor, LocalState, FlowRouter, Accounts }, email, password) {

    if (!email || !password) {
      return LocalState.set('LOGIN_ERROR', 'Login & Password are required!');
    }

    LocalState.set('LOGIN_ERROR', null);

    Meteor.loginWithPassword(email, password, (err) => {
      if (err && err.reason) {
        return LocalState.set('LOGIN_ERROR', err.reason);
      }
      FlowRouter.go('/account');
    });

  },

  loginErrorClear({ LocalState }) {
    return LocalState.set('LOGIN_ERROR', null);
  },

  register({ Meteor, LocalState, FlowRouter, Accounts }, firstName, email, password) {

    if (!firstName || !email || !password) {
      return LocalState.set('REGISTER_ERROR', 'Please fill out all the required fileds!');
    }

    Accounts.createUser({ firstName, email, password }, (err) => {
      if (err && err.reason) {
        return LocalState.set('REGISTER_ERROR', err.reason);
      }
      FlowRouter.go('/account');
    });
  },

  registerErrorClear({ LocalState }) {
    return LocalState.set('REGISTER_ERROR', null);
  },

};
