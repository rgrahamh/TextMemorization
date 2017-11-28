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
        path: '/api/foo/{id}',
        config: {
            description: 'Replace a foo by ID',
            tags: ['fooze', 'quuxen'],
            validate: {
                params: {
                    id: Joi.number().integer().min(1).required().description('Foo of interest')
                },
                payload: {
                    baz: Joi.string().required().description('Baz-i-fier'),
                    quux: Joi.string().length(17).description('Optional quux')
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
