import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';
import { FacebookAuthServiceProvider, GoogleAuthServiceProvider, GitHubAuthServiceProvider } from './authentication/auth-service-providers';
import { Profiles } from '../../api/profiles/profiles'

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
  update() {
    return true;
  },
});

// Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell
const AUTH_METHODS = [
  'login',
  'logout',
  'logoutOtherClients',
  'getNewToken',
  'removeOtherTokens',
  'configureLoginService',
  'changePassword',
  'forgotPassword',
  'resetPassword',
  'verifyEmail',
  'createUser',
  'ATRemoveService',
  'ATCreateUserServer',
  'ATResendVerificationEmail',
];

if (Meteor.isServer) {
  // Only allow 2 login attempts per connection per 5 seconds
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(AUTH_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);


  console.log('configuring external authentication services');

  let providers = [new FacebookAuthServiceProvider(),
  new GoogleAuthServiceProvider(),
  new GitHubAuthServiceProvider()];

  providers.forEach(provider => provider.configure());



  Accounts.onCreateUser((options, user) => {

    user.profile = options.profile;
    providers.forEach(p => user = p.getUser(options, user));

    return user;
  });


  //TODO: remove the following hook once the profile editing feature is implemented
  Accounts.onLogin(function () {

    const user = Meteor.user();
    let userName = user.emails[0].address.split('@')[0];

    let profile = Profiles.findOne({ ownerId: user._id });

    if (profile)
    { return; }

    console.log('logged in user', user);

    Profiles.insert({
      userName,
      ownerId: user._id
    });
  });
}
