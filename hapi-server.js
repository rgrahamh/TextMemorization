//Example code by Prof. Nurk

const Hapi = require('hapi');
const Joi = require('joi');
const server = new Hapi.Server();

//Configure the port on which the server will listen
server.connection({port: 3000});

//Define routes
server.route([
    {
        method: 'GET',
        path: '/api/foo/{id}',
        config: {
            description: 'Fetch a foo by ID',
            tags: ['fooze'],
            notes: ['A deeply moving note.',
                        'A hemidemisemiuaver (64th note).'],
            validate: {
                params: {
                    id: Joi.number().integer().min(1).required().description('Foo of interest')
                }
            }
        },
        handler: function(reuest, reply){
            //...
        }
    },
    {
        method: 'PUT',
        path: '/make-account',
        config: {
            description: 'Creates an account.',
            tags: ['fooze', 'quuxen'],
            validate: {
                payload: {
                    user: Joi.string().required().description('The username of the added user'),
                    pass: Joi.string().required().description('The passord of the added user'),
                    name: Joi.string().required().description('The user\'s full name'),
                    email: Joi.string().required().description('The required email contact'),
                    language: Joi.string().required().description('The preferred language of the user'),
                    mail: Joi.string().required().description('The user\'s traditional mail address')
                }
            }
        },
        handler: function(request, reply) {
            //...
        }
    },
    {
        method: 'PATCH',
        path: '/reset-pass',
        config: {
            description: 'Resets a pass.',
            tags: ['fooze', 'quuxen'],
            validate: {
                payload: {
                    user: Joi.string().required().description('The username of the added user'),
                    oldPass: Joi.string().required().description('The passord of the added user'),
                    newPass: Joi.string().required().description('The user\'s full name'),
                }
            }
        },
        handler: function(request, reply) {
            //...
        }
    },
    {
        method: 'PATCH',
        path: '/purchase',
        config: {
            description: 'Resets a pass.',
            tags: ['fooze', 'quuxen'],
            validate: {
                payload: {
                    user: Joi.string().required().description('The username of the added user'),
                    oldPass: Joi.string().required().description('The passord of the added user'),
                    newPass: Joi.string().required().description('The user\'s full name'),
                }
            }
        },
        handler: function(request, reply) {
            //...
        }
    }
]);

server.register([
    require('vision'),
    require('inert'),
    require('lout'),
], err => {
    if(err) {
        throw err;
    }
    server.start(err => {
        if (err) {
            throw err
        }
        console.log('Server running at', server.info.uri);
    });
});
