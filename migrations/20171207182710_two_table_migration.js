exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', users => {
        users.string('password').notNull();
        users.integer('num_successful_login_attempts').notNull();
        users.integer('num_unsuccessful_login_attempts').notNull();
        users.date('registered_until').notNull();
        users.dropColumn('is_registered');
    })
        .then(() => knex.schema.dropTable('auth'));
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('auth', table => {
        table.string('login_name').primary();
        table.string('password').notNull();
        table.integer('num_successful_attempts').notNull();
        table.integer('num_unsuccessful_attempts').notNull();
    })
    .then(() => knex.schema.alterTable('users', users => {
        users.dropColumn('password');
        users.dropColumn('num_successful_login_attempts');
        users.dropColumn('num_unsuccessful_login_attempts');
        users.boolean('is_registered').notNull();
    }));
};
