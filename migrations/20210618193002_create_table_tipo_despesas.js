
exports.up = function (knex) {
  
        return knex.schema.createTable('tpDespesas', table => {
            table.increments('id').primary()
            table.string('descricao').notNull()

        })
    
};

exports.down = function (knex) {
    return knex.schema.dropTable('tpDespesas')
};
