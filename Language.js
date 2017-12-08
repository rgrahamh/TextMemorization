const { Model } = require('objection');

class Language extends Model {
    static get tableName() {
        return 'language';
    }
    static get relationMappings(){
        return {
            payment: {
                relation: Model.OneToManyRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'users.language_id',
                    to: 'language.language_id'
                }
            }
        }
    }
}

module.exports = Language;
