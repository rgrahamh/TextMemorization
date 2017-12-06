const Hapi = require('hapi');
const Boom = require('boom');
const Lab = require('lab');
const Code = require('code');
const Joi = require('joi');
const knex = require('knex')(require('./knexfile.js').development);
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


const server = new Hapi.Server();

const Session = require('./Session.js');
const Auth = require('./Auth.js');
const Users = require('./Users.js');
const Payment = require('./Payment.js');
const JWT_SECRET_KEY = require('./password.js')['jwtkey'];


function createToken(userId) {
    return JWT.sign(
        {userId: userId},
        JWT_SECRET_KEY,
        {algorithm: 'HS256', expiresIn: "1d"}
    );
}

function validateUser(decoded, request, callback) {
   if (decoded.hasOwnProperty('userId')) {
       User.query().findById(decoded.userId)
       .then(user => {
           if (user) {
               callback(null, true);
           } else {
               callback(null, false);
           }
           })
       .catch(err => callback(null, false));
   } else {
       callback(null, false);
   }
}




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
            reply("This is where you <em>should</em> be able to make an account");
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
                    last_name: Joi.string().required().description('The first name of the added user'),
                    first_name: Joi.string().required().description('The last name of the added user'),
                    middle_name: Joi.string().required().description('The user\'s middle name'),
                    preferred_name: Joi.string().required().description('The preferred name of the added user'),
                    login_name: Joi.string().required().description('The user\'s login name'),
                    email: Joi.string().required().description('The required email contact'),
                    preferred_language: Joi.string().required().description('The preferred language of the user'),
                    address: Joi.string().required().description('The user\'s traditional mail address'),
                    password: Joi.string().required().description('The user\'s password')
                }
            }
        },
        handler: function(request, reply) {
            knex('users').insert(
                {
                    last_name: request.payload.last_name,
                    first_name: request.payload.first_name,
                    middle_name: request.payload.middle_name,
                    preferred_name: request.payload.preferred_name,
                    login_name: request.payload.login_name,
                    email: request.payload.email,
                    preferred_language: request.payload.preferred_language,
                    address: request.payload.address,
                    is_registered: false
                }
            )
            .then(knex('auth').insert(
                {
                    login_name: request.payload.login_name,
                    password: request.payload.password,
                    num_unsuccessful_attempts: 0,
                    num_successful_attempts: 0

                }
            ).then(a => {} ))
            .then(reply({creation: "Successfully created!"}));
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
            reply("This is where you <em>should</em> be able to login");
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
   /* {
        method: 'GET',
        
    },*/
    {
        method: 'GET',
        path: '/change-pass',
        config: {
            description: 'Password reset page',
            notes: ['If status code is 200: return payload of HTML/CSS/JS password reset page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ]
        },
        handler: function(request, reply){
            reply("This is where you <em>should</em> be able to reset your password");
        }
    },
    {
        method: 'PUT',
        path: '/change-pass',
        config: {
            description: 'Resets a pass.',
            notes: ['If status code is 200: change password field for given record in the User table in the database.',
                    'If status code is 406: return Boom.notAcceptable("Current password incorrect...")',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                   ],
            validate: {
                payload: {
                    login_name: Joi.string().required().description('The username of the added user'),
                    oldPass: Joi.string().required().description('The passord of the added user'),
                    newPass: Joi.string().required().description('The user\'s full name'),
                }
            }
        },
        handler: function(request, reply) {
            knex('auth')
                .where('login_name', 'LIKE', request.params.login_name)
                .andWhere('password', 'LIKE', request.params.oldPass)
                .update({
                    password: request.payload.newPass
                })
            .then(reply({updated: "Password updated!"}));
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
                    user_id: Joi.number().integer().min(0).required().description('The user id  of the user making the purchase')
                }
            }
        },
        handler: function(request, reply) {
            const d = new Date(); //The current date
            const subscriptionCost = 4.99; //Change this number if you change the cost of a subscription
            knex('payment').insert(
                {
                    user_id: request.payload.user_id,
                    date: d,
                    cost: subscriptionCost,
                    paid: true //Figure out a way to validate later
                }
            )
            .then(reply({payment: "Complete!"}))
        }
    }
]);

server.register([
    require('vision'),
    require('inert'),
    require('lout'),
    require('hapi-auth-jwt2'),
], err => {
    if(err) {
        throw err;
    }

    server.auth.strategy('webtoken', 'jwt', {
        key: JWT_SECRET_KEY,
        validateFunc: validateUser,
        verifyOptions: {algorithms: ['HS256']}
    });

    server.start(err => {
        if (err) {
            throw err
        }
        console.log('Server running at', server.info.uri);
    });
});
