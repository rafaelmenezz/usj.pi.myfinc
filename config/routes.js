module.exports = app => {
    app.post('/signup', app.api.usuario.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)


    app.route('/usuarios')
        //.all(app.config.passport.authenticate())
        .post(app.api.usuario.save)
        .get(app.api.usuario.get)

    app.route('/usuarios/:id')
        //.all(app.config.passport.authenticate())
        .put(app.api.usuario.save)
        .get(app.api.usuario.getById)

    app.route('/tp_receitas')
        // .all(app.config.passport.authenticate())
        .post(app.api.tp_receitas.save)
        .get(app.api.tp_receitas.get)

    app.route('/tp_receitas/:id')
       // .all(app.config.passport.authenticate())
        .put(app.api.tp_receitas.save)
        .get(app.api.tp_receitas.getById)
        .delete(app.api.tp_receitas.remove)

    app.route('/tp_despesas/')
       // .all(app.config.passport.authenticate())
        .post(app.api.tp_despesas.save)
        .get(app.api.tp_despesas.get)

    app.route('/tp_despesas/:id')
       // .all(app.config.passport.authenticate())
        .put(app.api.tp_despesas.save)
        .get(app.api.tp_despesas.getById)
        .delete(app.api.tp_despesas.remove)

    app.route('/receitas/:usuario_id')
        //.all(app.config.passport.authenticate())
        .post(app.api.receitas.save)
        .get(app.api.receitas.get)

    app.route('/receitas/:usuario_id/:id')
        //.all(app.config.passport.authenticate())
        .put(app.api.receitas.save)
        .get(app.api.receitas.getById)
        .delete(app.api.receitas.remove)

    app.route('/despesas/:usuario_id') 
        //.all(app.config.passport.authenticate())
        .post(app.api.despesas.save)
        .get(app.api.despesas.get)

    app.route('/despesas/:usuario_id/:id')
         // .all(app.config.passport.authenticate())
        .put(app.api.despesas.save)
        .get(app.api.despesas.getById)
        .delete(app.api.despesas.remove)

    app.route('/despesas/data/:usuario_id/:data')
        //  .all(app.config.passport.authenticate())
        .get(app.api.despesas.getByMes)

    app.route('/receitas/data/:usuario_id/:data')
       // .all(app.config.passport.authenticate())
        .get(app.api.receitas.getByMes)

    app.route('/admin/:id')
       // .all(app.config.passport.authenticate())
        .get(app.api.admin.get)

}