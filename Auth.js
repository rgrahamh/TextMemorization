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
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'auth.login_name',
                    to: 'user.login_name'
                }
            }
        }
    }
}

module.exports = Auth;
