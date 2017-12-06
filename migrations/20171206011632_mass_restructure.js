exports.up = function(knex, Promise) {
    return knex.schema.dropTable('session');
    .then(() => knex.schema.alterTable('auth', auth => {
        auth.dropColumn('login_id');
        auth.primary('login_name');
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema
        .createTable('session', table => {
        table.increments('login_id');
        table.dateTime('last_request_time');
    })
    .then(() => knex.schema.alterTable('auth', auth => {
        auth.login_name
        auth.increments('login_id').primary();

    }));
};
