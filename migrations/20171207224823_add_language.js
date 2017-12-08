exports.up = function(knex, Promise) {
    return knex.schema.createTable('language', lang => {
        lang.increments('lanuage_id');
        lang.string('language_name');
    })
        .then(() => knex.schema.alterTable('users', users => {
            users.dropColumn('preferred_language');
            users.integer('language_id');
        }));
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('language')
        .then(() => knex.schema.alterTable('users', users => {
            users.dropColumn('language_id');
            users.string('preferred_language');
        }));
};
