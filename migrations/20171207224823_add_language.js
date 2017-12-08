exports.up = function(knex, Promise) {
    return knex.schema.createTable('language', lang => {
        lang.increments('language_id');
        lang.string('language_name').unique().notNull();
    })
        .then(() => knex.schema.alterTable('users', users => {
            users.dropColumn('preferred_language');
            users.integer('language_id').notNull();
        }));
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('language')
        .then(() => knex.schema.alterTable('users', users => {
            users.dropColumn('language_id');
            users.string('preferred_language').notNull();
        }));
};
