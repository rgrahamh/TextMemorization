exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('session', table => {
        table.increments('login_id');
        table.dateTime('last_request_time');
    })
    .then(() => knex.schema.createTable('auth', table => {
        table.increments('login_id');
        table.string('login_name');
        table.string('password');
        table.integer('num_successful_attempts');
        table.integer('num_unsuccessful_attempts');
    }))
    .then(() => knex.schema.createTable('users', table => {
        table.increments('user_id');
        table.string('login_name');
        table.string('last_name');
        table.string('first_name');
        table.string('middle_name');
        table.string('preferred_name');
        table.string('email');
        table.string('preferred_language');
        table.string('address');
        table.boolean('is_registered');
    }))
    .then(() => knex.schema.createTable('payment', table => {
        table.increments('transaction_id');
        table.integer('user_id');
        table.float('cost');
        table.dateTime('date');
        table.boolean('paid');
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('session')
        .then(() => knex.schema.dropTable('auth'))
        .then(() => knex.schema.dropTable('users'))
        .then(() => knex.schema.dropTable('payment'));
};
