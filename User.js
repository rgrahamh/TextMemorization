const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'user';
    }
    static get relationMappings(){
        return {
            payment: {
                relation: Model.OneToManyRelation,
                modelClass: __dirname + '/Payment',
                join: {
                    from: 'user.user_id',
                    to: 'payment.user_id'
                }
            }
        }
    }
}

module.exports = User;
