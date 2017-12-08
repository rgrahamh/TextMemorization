exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('session', table => {
        table.increments('login_id').notNull();
        table.dateTime('last_request_time').notNull();
    })
    .then(() => knex.schema.createTable('auth', table => {
        table.increments('login_id');
        table.string('login_name').notNull();
        table.string('password').notNull();
        table.integer('num_successful_attempts').notNull();
        table.integer('num_unsuccessful_attempts').notNull();
    }))
    .then(() => knex.schema.createTable('users', table => {
        table.increments('user_id');
        table.string('login_name').notNull();
        table.string('last_name').notNull();
        table.string('first_name').notNull();
        table.string('middle_name').notNull();
        table.string('preferred_name').notNull();
        table.string('email').notNull();
        table.string('preferred_language').notNull();
        table.string('address').notNull();
        table.boolean('is_registered').notNull();
    }))
    .then(() => knex.schema.createTable('payment', table => {
        table.increments('transaction_id');
        table.integer('user_id').notNull();
        table.float('cost').notNull();
        table.dateTime('date').notNull();
        table.boolean('paid').notNull();
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('session')
        .then(() => knex.schema.dropTable('auth'))
        .then(() => knex.schema.dropTable('users'))
        .then(() => knex.schema.dropTable('payment'));
};
