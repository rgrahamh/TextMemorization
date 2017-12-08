const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const expect = Code.expect;

lab.experiment('routes', () => {

    lab.test('should add positive numbers', done => {
        expect(42+17).to.equal(59);
        done();
    });
});

