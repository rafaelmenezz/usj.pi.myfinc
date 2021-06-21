// Update with your config settings.

module.exports = {

    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'myfinc',
      user:     'root',
      password: '605279'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
