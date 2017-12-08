const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const expect = Code.expect;

const server = require('./hapi-server.js');

lab.experiment('routes', () => {

    lab.test('addition', done => {
        expect(42+17).to.equal(59);
        done();
    });

    lab.test('omit field in /make-account', done => {
        server.inject({ method: 'PUT',
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
                            expect(JSON.parse(response.payload)).to.equal({ "creation": "Successfully created! "});
                            done();
                        });
        });

});

