import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

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



  var appId = '225787677866487';
  var appSecret = '4cbf0bf65ae691e8e218007e5ebabf21';


  console.log('configuring facebbok');



  ServiceConfiguration.configurations.upsert(
    { service: 'facebook' },
    {
      $set: {
        appId: appId,
        secret: appSecret
      }
    });


  Accounts.onCreateUser((options, user) => {
    
    let profile = options.profile;

    //Modules.server.sendWelcomeEmail(user, profile);


    if (profile) {
      if (profile.name) {
        profile.fullName = profile.name;
      }
      user.profile = profile;
    }

    if (user.services && user.services.facebook) {
      user.emails = [{
        address: user.services.facebook.email,
        verified: false
      }];
    }

    console.log(user);

    return user;
  });
}
