exports.up = function (knex) {
  
   return knex.schema.createTable('tp_despesas', table => {
       table.increments('id').primary()
       table.string('descricao').notNull()

   })

};

exports.down = function (knex) {
return knex.schema.dropTable('tp_despesas')
};