const Hapi = require('hapi');
const Boom = require('boom');
const Lab = require('lab');
const Code = require('code');
const Joi = require('joi');
const knex = require('knex');
const server = new Hapi.Server();

const Session = require('./Session.js');
const Auth = require('./Auth.js');
const User = require('./User.js');
const Payment = require('./Payment.js');

//Configure the port on which the server will listen
server.connection({port: 3000});

//Define routes
server.route([
    {
        method: 'GET',
        path: '/make-account',
        config: {
            description: 'Account creation page',
            notes: ['If status code is 200: return payload of HTML/CSS/JS registration page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ]
        },
        handler: function(request, reply){
            //...
        }
    },
    {
        method: 'PUT',
        path: '/make-account',
        config: {
            description: 'Creates an account.',
            notes: ['If status code is 200: create a new user record in the User table in the database.',
                    'If status code is 403: return Boom.forbidden("User record already exists...")',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ],
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
           knex('user').insert([
               {
                   user: request.payload.user,
                   pass: request.payload.pass,
                   name: request.payload.name,
                   email: request.payload.email,
                   language: request.payload.language,
                   mail: request.payload.mail
               }
           ]);
        }
    },
    {
        method: 'GET',
        path: '/login',
        config: {
            description: 'Login page',
            notes: ['If status code is 200: return payload of HTML/CSS/JS login page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ]
        },
        handler: function(request, reply){
            //...
        }
    },
    {
        method: 'POST',
        path: '/login',
        config: {
            description: 'Validates user login attempt.',
            notes: ['If status code is 200: Creates a new session.',
                    'If status code is 401: return Boom.unauthorized("Incorrect password")',
                    'If status code is 404: return Boom.notFound("Page not found...")',
                    'We\'re honestly not sure if we need this route or not. We will know once we learn about user authentication!'
                   ],
            validate: {
                payload: {
                    user: Joi.string().required().description('The username of the user'),
                    pass: Joi.string().required().description('The passord of the user'),
                }
            }
        },
        handler: function(request, reply) {
            //...
        }
    },
    {
        method: 'GET',
        path: '/reset-pass',
        config: {
            description: 'Password reset page',
            notes: ['If status code is 200: return payload of HTML/CSS/JS password reset page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ]
        },
        handler: function(request, reply){
            //...
        }
    },
    {
        method: 'PATCH',
        path: '/reset-pass',
        config: {
            description: 'Resets a pass.',
            notes: ['If status code is 200: change password field for given record in the User table in the database.',
                    'If status code is 406: return Boom.notAcceptable("Current password incorrect...")',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ],
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
        method: 'GET',
        path: '/purchase',
        config: {
            description: 'Subscription purchase page',
            notes: ['If status code is 200: return payload of HTML/CSS/JS subscription purchase page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ]
        },
        handler: function(request, reply){
            //...
        }
    },
    {
        method: 'PUT',
        path: '/purchase',
        config: {
            description: 'Create a purchase record in the Payment table of the database.',
            notes: ['If status code is 200: create a new purchase record in the Payment table in the database.',
                    'If status code is 402: return Boom.paymentRequired("Appropriate payment was not received...")',
                    'If status code is 409: return Boom.conflict("User already has a subscription...")',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ],
            validate: {
                payload: {
                    user: Joi.number().integer().min(0).required().description('The user id  of the user making the purchase')
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
