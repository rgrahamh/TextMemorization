module.exports = {
    development: {
        client: 'postgresql',
        conenction: {
            host: 'faraday.cse.taylor.edu',
            database: 'rgrahamh',
            user: 'rgrahamh',
            password: 'faxudaku'
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
}
