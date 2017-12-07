exports.up = function(knex, Promise) {
    return knex.schema.dropTable('session')
    .then(() => knex.schema.alterTable('auth', auth => {
        auth.dropColumn('login_id');
        auth.primary('login_name');
    }))
    .then(() => knex.schema.alterTable('users', users => {
        users.dropColumn('user_id');
        users.primary('login_name');
    }))
    .then(() => knex.schema.alterTable('payment', pay => {
        pay.string('login_name');
        pay.dropColumn('user_id');
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('session', table => {
        table.increments('login_id');
        table.dateTime('last_request_time');
    })
    .then(() => knex.schema.alterTable('auth', auth => {
        auth.dropPrimary();
    }))
    .then(() => knex.schema.alterTable('auth', auth => {
        auth.increments('login_id').primary();
    }))
    .then(() => knex.schema.alterTable('users', users => {
        users.dropPrimary()
    }))
    .then(() => knex.schema.alterTable('users', users => {
        users.increments('user_id').primary();
    }))
    .then(() => knex.schema.alterTable('payment', pay => {
        pay.integer('user_id');
        pay.dropColumn('login_name');
    }));
};
