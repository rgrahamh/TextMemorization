const { Model } = require('objection');

class Payment extends Model {
    static get tableName() {
        return 'payment';
    }
    static get relationMappings(){
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'payment.login_name',
                    to: 'users.login_name'
                }
            }
        }
    }
}

module.exports = Payment;
