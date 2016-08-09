Package.describe({
    name: 'pro-ideas:kanban',
    version: '1.0.0',
    summary: 'kanaban board for ideaboard', 
    documentation: null,
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.4');

    var packages = [

        // Meteor packages
        'meteor-base@1.0.4',
        'mongo',
        'tracker',
        'service-configuration',        
        'modules@0.5.2',        
        'check',
        'http',
        'tracker',
        'ecmascript@0.4.2',
        'react-meteor-data@0.2.8',
        'service-configuration',

        // data
        'aldeed:simple-schema',
        'aldeed:collection2',
        'dburles:collection-helpers',
        'reywood:publish-composite',
        'mdg:validated-method',
        'mdg:validation-error',

        //# i18n
        'tap:i18n',
        'universe:react-markdown-wysiwyg',
        'universe:modules',      
        'fourseven:scss'  
        

    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles('api/index.js', 'server');
    api.mainModule('client/index.jsx', ['client']);    
    //api.export('Factory');
});

// Package.onTest(function(api) {
//   api.use(['ecmascript', 'tinytest', 'factory', 'underscore']);
//   api.addFiles('factory-tests.js', 'server');
// });
