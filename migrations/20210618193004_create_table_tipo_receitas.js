
exports.up = function (knex) {
  
        return knex.schema.createTable('tpReceitas', table => {
            table.increments('id').primary()
            table.string('descricao').notNull()

        })
  
};

exports.down = function (knex) {
    return knex.schema.dropTable('tpReceitas')
};
