exports.up = function(knex, Promise) {
    return knex.schema.dropTable('auth')
    .then(() => knex.schema.alterTable('users', users => {
        users.string('password');
        users.integer('num_successful_login_attempts');
        users.integer('num_unsuccessful_login_attempts');
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('auth', table => {
        table.string('login_name').primary();
        table.string('password');
        table.integer('num_successful_attempts');
        table.integer('num_unsuccessful_attempts');
    })
    .then(() => knex.schema.alterTable('users', users => {
        users.dropColumn('password');
        users.dropColumn('num_successful_login_attempts');
        users.dropColumn('num_unsuccessful_login_attempts');
    }));
};
