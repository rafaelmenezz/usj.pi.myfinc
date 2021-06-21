
exports.up = function(knex) {
  
        return knex.schema.createTable('despesas', table => {
            table.increments('id').primary()
            table.decimal('valor').notNull()
            table.string('formaPagamento').notNull()
            table.string('local').notNull()
            table.date('data').notNull().defaultTo(knex.raw('CURRENT_DATE()'))
            table.integer('usuarioId').unsigned().notNull()
            table.integer('tpDespesaId').unsigned().notNull()
            table.foreign('usuarioId').references('usuarios.id')
            table.foreign('tpDespesaId').references('tpDespesas.id');    
  
        })
    
};

exports.down = function(knex) {
    return knex.schema.dropTable('despesas')
};
