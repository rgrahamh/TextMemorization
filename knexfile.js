module.exports = {
    development: {
        client: 'postgresql',
        conenction: {
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
