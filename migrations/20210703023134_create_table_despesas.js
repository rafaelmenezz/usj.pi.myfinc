
exports.up = function(knex) {
  
   return knex.schema.createTable('despesas', table => {
       table.increments('id').primary()
       table.decimal('valor').notNull()
       table.string('forma_pagamento').notNull()
       table.string('local').notNull()
       table.date('data').notNull().defaultTo(knex.raw('CURRENT_DATE'))
       table.integer('usuario_id').unsigned().notNull()
       table.integer('tp_despesa_id').unsigned().notNull()
       table.foreign('usuario_id').references('usuarios.id')
       table.foreign('tp_despesa_id').references('tp_despesas.id');    

   })

};

exports.down = function(knex) {
return knex.schema.dropTable('despesas')
};