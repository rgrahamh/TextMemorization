const { Model } = require('objection');

class Auth extends Model {
    static get tableName() {
        return 'auth';
    }
    static get relationMappings(){
        return {
            session: {
                relation: Model.OneToManyRelation,
                modelClass: __dirname + '/Session',
                join: {
                    from: 'auth.login_id',
                    to: 'session.login_id'
                }
            },
            user: {
                relation: Model.BelongsToOne,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'auth.login_name',
                    to: 'users.login_name'
                }
            }
        };
    }
}

module.exports = Auth;
