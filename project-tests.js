const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const expect = Code.expect;

const server = require('./hapi-server.js');

lab.experiment('routes', () => {

    lab.test('valid /make-account request', done => {
        server.inject({ method: 'POST',
                        url: '/make-account', 
                        payload: { 
                            last_name: "Last", 
                            first_name: "First", 
                            middle_name: "Middle",
                            preferred_name: "Pref",
                            login_name: "test",
                            email: "test@test.com",
                            preferred_language: "English",
                            address: "address",
                            password: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.payload)).to.equal({ "creation": "Successfully created!"});
                            done();
                        });
    });


    lab.test('omit required field in /make-account request', done => {
        server.inject({ method: 'POST',
                        url: '/make-account', 
                        payload: { 
                            last_name: "Last", 
                            first_name: "First", 
                            middle_name: "Middle",
                            preferred_name: "Pref",
                            login_name: "test",
                            preferred_language: "English",
                            address: "address",
                            password: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(400);
                            done();
                        });
    });

    lab.test('try to find page that doesn\'t exist', done => {
        server.inject({ method: 'GET',
                        url: '/fake-url',
                        payload: {},
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(404);
                            done();
                        });
    });
                            
    lab.test('valid /login request', done => {
        server.inject({ method: 'POST',
                        url: '/login',
                        payload: {
                            user: "test",
                            password: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(200);
                            done();
                        });
    });
    
    lab.test('/login invalid user', done => {
        server.inject({ method: 'POST',
                        url: '/login',
                        payload: {
                            user: "nonexistent-user",
                            password: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(400);
                            done();
                        });
    });

    lab.test('/login invalid password', done => {
        server.inject({ method: 'POST',
                        url: '/login',
                        payload: {
                            user: "test",
                            password: "wrong-password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(400);
                            done();
                        });
    });

    lab.test('/login omit user', done => {
        server.inject({ method: 'POST',
                        url: '/login',
                        payload: {
                            password: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(400);
                            done();
                        });
    });

    lab.test('/login omit password', done => {
        server.inject({ method: 'POST',
                        url: '/login',
                        payload: {
                            user: "test",
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(400);
                            done();
                        });
    });

    lab.test('valid /change-pass request', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            login_name: "test",
                            oldPass: "password",
                            newPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(200);
                            done();
                        });
    });

    lab.test('/change-pass invalid user', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            login_name: "nonexistent-user",
                            oldPass: "password",
                            newPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('/change-pass invalid pass', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            login_name: "test",
                            oldPass: "bad-pass",
                            newPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('/change-pass omit user', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            oldPass: "password",
                            newPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('/change-pass omit oldPass', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            user: "test",
                            newPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('/change-pass omit newPass', done => {
        server.inject({ method: 'PUT',
                        url: '/change-pass',
                        payload: {
                            user: "test",
                            oldPass: "password"
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('valid /purchase request', done => {
        server.inject({ method: 'PUT',
                        url: '/purchase',
                        payload: {
                            user_id: '1'
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(200);
                            done();
                        });
    });

    lab.test('/purchase bad user_id', done => {
        server.inject({ method: 'PUT',
                        url: '/purchase',
                        payload: {
                            user_id: 'abc'
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

    lab.test('/purchase omit user_id', done => {
        server.inject({ method: 'PUT',
                        url: '/purchase',
                        payload: {
                        },
                        },
                        response => {
                            expect(JSON.parse(response.statusCode)).to.equal(401);
                            done();
                        });
    });

});

