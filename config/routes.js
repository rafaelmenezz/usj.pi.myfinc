module.exports = app => {
    app.post('/signup', app.api.usuario.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)


    app.route('/usuarios')
        .all(app.config.passport.authenticate())
        .post(app.api.usuario.save)
        .get(app.api.usuario.get)

    app.route('/usuarios/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.usuario.save)
        .get(app.api.usuario.getById)

    app.route('/tpReceitas')
        .all(app.config.passport.authenticate())
        .post(app.api.tpReceita.save)
        .get(app.api.tpReceita.get)

    app.route('/tpReceitas/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.tpReceita.save)
        .get(app.api.tpReceita.getById)
        .delete(app.api.tpReceita.remove)

    app.route('/tpDespesas')
        .all(app.config.passport.authenticate())
        .post(app.api.tpDespesa.save)
        .get(app.api.tpDespesa.get)

    app.route('/tpDespesas/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.tpDespesa.save)
        .get(app.api.tpDespesa.getById)
        .delete(app.api.tpDespesa.remove)

    app.route('/receitas')
        .all(app.config.passport.authenticate())
        .post(app.api.receita.save)
        .get(app.api.receita.get)

    app.route('/receitas/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.receita.save)
        .get(app.api.receita.getById)
        .delete(app.api.receita.remove)
    app.route('/despesas')
        .all(app.config.passport.authenticate())
        .post(app.api.despesa.save)
        .get(app.api.despesa.get)

    app.route('/despesas/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.despesa.save)
        .get(app.api.despesa.getById)
        .delete(app.api.despesa.remove)
}