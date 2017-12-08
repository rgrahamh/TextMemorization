exports.up = function(knex, Promise) {
    return knex.schema.dropTable('auth')
    .then(() => knex.schema.alterTable('users', users => {
        users.string('password');
        users.integer('num_successful_attempts');
        users.integer('num_unsuccessful_attempts');
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('auth', table => {
        table.increments('login_id');
        table.string('login_name');
        table.string('password');
        table.integer('num_successful_attempts');
        table.integer('num_unsuccessful_attempts');
    })
    .then(() => knex.schema.alterTable('users', users => {
        users.dropColumn('password');
        users.dropColumn('num_successful_attempts');
        users.dropColumn('num_unsuccessful_attempts');
    }));
};
