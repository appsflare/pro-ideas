import { Meteor } from 'meteor/meteor';
//import { BrowserPolicy } from 'meteor/browser-policy';

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// This file configures the Accounts package to define the UI of the reset password email.
import './reset-password-email.js';

// Set up some rate limiting and other important security settings.
import './security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';

import './migrations/index';



Meteor.startup(() => {
    Migrations.migrateTo('latest');    

    ['fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'www.gravatar.com',
        'at.alicdn.com']
        .forEach(origin => BrowserPolicy.content.allowOriginForAll(origin));

});
