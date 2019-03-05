// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : 'your-client-key-here', // your App ID
        'clientSecret'    : 'your-secret-here', // your App Secret
        'callbackURL'     : 'http://localhost:2000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:2000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-client-key-here',
        'clientSecret'     : 'your-secret-here',
        'callbackURL'      : 'http://localhost:5000/auth/google/callback'
    }

    
};
