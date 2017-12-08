const { Model } = require('objection');

class Users extends Model {
    static get tableName() {
        return 'users';
    }
    static get relationMappings(){
        return {
            payment: {
                relation: Model.OneToManyRelation,
                modelClass: __dirname + '/Payment',
                join: {
                    from: 'users.login_name',
                    to: 'payment.login_name'
                }
            }
        }
    }
}

module.exports = { Users };
