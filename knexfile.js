module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'faraday.cse.taylor.edu',
            database: 'memex_2_a',
            user: 'rgrahamh',
            password: 'faxudaku'
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
