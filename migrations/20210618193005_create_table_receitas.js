
exports.up = function (knex) {

    return knex.schema.createTable('receitas', table => {
        table.increments('id').primary()
        table.decimal('valor').notNull()
        table.string('formaRecebimento').notNull()
        table.string('local').notNull()
        table.date('data').notNull().defaultTo(knex.raw('CURRENT_DATE()'))
        table.integer('usuarioId').unsigned().notNull()
        table.integer('tpReceitaId').unsigned().notNull()
        table.foreign('usuarioId').references('usuarios.id')
        table.foreign('tpReceitaId').references('tpReceitas.id');    
    })

};

exports.down = function (knex) {
    return knex.schema.dropTable('receitas')
};
