const Hapi = require('hapi');
const Boom = require('boom');
const Lab = require('lab');
const Code = require('code');
const Joi = require('joi');
const knex = require('knex')(require('./knexfile.js').development);
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { Model } = require('objection');
Model.knex(knex);

const server = new Hapi.Server();

const { Language } = require('./Language.js');
const { Users } = require('./Users.js');
const { Payment } = require('./Payment.js');
const JWT_SECRET_KEY = "test-key";//require('./password.js')['jwtkey'];


//bcrypt password
function checkPassword(plaintextPass, hashedPass) {
    return Bcrypt.compare(plaintextPass, hashedPass);
}

function hashPassword(plaintextPass) {
    return Bcrypt.hash(plaintextPass, 10);
}



// auth
function createToken(userId) {
    return JWT.sign(
        { userId: userId },
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: "1d" }
    );
}

//Inserts a language; language must be a string
function insertLanguage(lang) {
    knex('language').insert({ language_name: lang })
        .catch(err => { });
}

function validateUser(decoded, request, callback) {
    if (decoded.hasOwnProperty('userId')) {
        Users.query()
            .where('login_name', decoded.userId)
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
server.connection({ port: 3000 });



server.register([
    require('vision'),
    require('inert'),
    require('lout'),
    require('hapi-auth-jwt2'),
], err => {
    if (err) {
        throw err;
    }

    server.auth.strategy('webtoken', 'jwt', {
        key: JWT_SECRET_KEY,
        validateFunc: validateUser,
        verifyOptions: { algorithms: ['HS256'] }
    });

    //Define routes
    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                description: 'Redirects to login page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS registration page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                ]
            },
            handler: function (request, reply) {
                reply.redirect('/login');
            }
        },
        {
            method: 'GET',
            path: '/make-account',
            config: {
                description: 'Account creation page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS registration page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                ]
            },
            handler: function (request, reply) {
                reply.file('./page_files/make_account.html');
            }
        },
        {
            method: 'POST',
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
            handler: function (request, reply) {
                Users.query()
                    .where('login_name', request.payload.login_name)
                    .count()
                    .then(rows => {
                        console.log(rows);
                        if (!rows || rows.count != '0') {
                            reply(Boom.forbidden('Username taken'))
                        } else {
                            Language.query()
                                .where('language_name', 'like', request.payload.preferred_language)
                                .first()
                                .then(language => {
                                    console.log(language);
                                    if (!language) {
                                        reply(Boom.forbidden('Invalid language'))
                                    } else {
                                        hashPassword(request.payload.password)
                                            .then(hashedPass => {
                                                var now = new Date();
                                                knex('users')
                                                    .insert(
                                                    {
                                                        last_name: request.payload.last_name,
                                                        first_name: request.payload.first_name,
                                                        middle_name: request.payload.middle_name,
                                                        preferred_name: request.payload.preferred_name,
                                                        login_name: request.payload.login_name,
                                                        email: request.payload.email,
                                                        language_id: language['language_id'],
                                                        address: request.payload.address,
                                                        registered_until: now.toISOString(),
                                                        password: hashedPass,
                                                        num_successful_login_attempts: 0,
                                                        num_unsuccessful_login_attempts: 0,
                                                    }
                                                    ).then(reply({ creation: "Successfully created!" }))
                                                    .catch(error => {
                                                        console.error(error);
                                                        console.log("bad");
                                                    });

                                            })

                                    }
                                })
                        }
                    })

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
            handler: function (request, reply) {
                reply.file('./page_files/login.html');
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
                ],
                validate: {
                    payload: {
                        user: Joi.string().required().description('The username of the user'),
                        pass: Joi.string().required().description('The password of the user'),
                    }
                }
            },
            handler: function (request, reply) {
                let userId = request.payload.user;
                Users.query()
                    .where('login_name', userId)
                    .first()
                    .then(user => {
                        if (!user) {
                            reply(Boom.notFound("No User Found"));
                        } else {
                            checkPassword(request.payload.pass, user.password)
                                .then(isValid => {
                                    if (isValid) {
                                        reply({ jwtIdToken: createToken(userId) });
                                    } else {
                                        reply(Boom.unauthorized('Authentication failed'));
                                    }
                                });
                        }
                    })

            }
        },
        {
            method: 'GET',
            path: '/reset-pass',
            config: {
                description: 'Password reset page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS password reset page.',
                    'If status code is 404: return Boom.notFound("Page not found...")']
            },
            handler: function (request, reply) {
                reply("Contact a system administrator to recover your lost password");
            }
        },/*
        {
            method: 'PATCH',
            path: '/reset-pass',
            config: {
                description: 'Resets a password',
                notes: ['If status code is 200: return payload of HTML/CSS/JS password reset page.',
                    'If status code is 404: return Boom.notFound("Page not found...")']
            },
            handler: function (request, reply) {
                //...
            }
        },*/
        {
            method: 'GET',
            path: '/change-pass',
            config: {
                description: 'Password changing page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS password reset page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'],
                auth: { strategy: 'webtoken' }
            },
            handler: function (request, reply) {
                reply.file('./page_files/reset_pass.html');//Change to change_pass.html once the page is constructed
            }
        },
        {
            method: 'PUT',
            path: '/change-pass',
            config: {
                description: 'Changes a password.',
                notes: ['If status code is 200: change password field for given record in the User table in the database.',
                    'If status code is 406: return Boom.notAcceptable("Current password incorrect...")',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                ],
                auth: { strategy: 'webtoken' },
                validate: {
                    payload: {
                        login_name: Joi.string().required().description('The username of the added user'),
                        oldPass: Joi.string().required().description('The password of the added user'),
                        newPass: Joi.string().required().description('The user\'s new password'),
                    }
                }
            },
            handler: function (request, reply) {
                Users.query()
                    .where('login_name', 'LIKE', request.payload.login_name)
                    .first()
                    .then(row => {
                        if (row && row.password){
                            checkPassword(request.payload.oldPass, row.password).then(valid => {
                                if (valid){
                                    hashPassword(request.payload.newPass).then(hashedPass => {
                                        knex('users')
                                        .update('password', hashedPass)
                                        .where('login_name', 'LIKE', request.payload.login_name)
                                        .then(reply({ updated: "Password updated!" }));
                                    })
                                } else {
                                    reply('error 1');
                                }
                            })
                        } else {
                            reply(Boom.notAcceptable("Invalid username or password"));
                        }
                    })
            }
        },
        {
            method: 'GET',
            path: '/purchase',
            config: {
                description: 'Subscription purchase page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS subscription purchase page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                ],
                auth: { strategy: 'webtoken' }
            },
            handler: function (request, reply) {
                reply.file('./page_files/purchase.html');
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
                auth: { strategy: 'webtoken' },
                validate: {
                    payload: {
                        user_id: Joi.string().min(0).required().description('The username of the user making the purchase')
                    }
                }
            },
            handler: function (request, reply) {
                const d = new Date(); //The current date
                const subscriptionCost = 4.99; //Change this number if you change the cost of a subscription
                knex('payment').insert(
                    {
                        login_name: request.payload.user_id,
                        date: d,
                        cost: subscriptionCost,
                        paid: true //Figure out a way to validate later
                    }
                )
                    .then(() => knex('users').update({registered_until: new Date(d.getYear()+1901, d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())}))
                    .then(() => reply({ payment: "Complete!" }));
            }
        },
        {
            method: 'GET',
            path: '/home',
            config: {
                description: 'Subscription purchase page',
                notes: ['If status code is 200: return payload of HTML/CSS/JS subscription purchase page.',
                    'If status code is 404: return Boom.notFound("Page not found...")'
                ],
                auth: { strategy: 'webtoken' }
            },
            handler: function (request, reply) {
                reply.file('./page_files/home.html');
            }
        },
    ]);


    server.start(err => {
        if (err) {
            throw err
        }
        knex('language').insert({ language_name: 'English' })
            .then(() => knex('language').insert({ language_name: 'Spanish' }))
            .then(() => knex('language').insert({ language_name: 'German' }))
            .then(() => knex('language').insert({ language_name: 'Chinese' }))
            .then(() => knex('language').insert({ language_name: '\'Merican' }))
            .then(() => { })
            .catch(err => { });
        insertLanguage('English');
        insertLanguage('Spanish');
        insertLanguage('German');
        insertLanguage('Chinese');
        insertLanguage('\'Merican');
        insertLanguage('Pig Latin');
        console.log('Server running at', server.info.uri);
    });
});

module.exports = server;

