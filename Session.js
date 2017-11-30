const { Model } = require('objection');

class Session extends Model {
    static get tableName() {
        return 'session';
    }
}

module.exports = Session;
