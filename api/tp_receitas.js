module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = async (req, res) => {
        const tp_receita = { ...req.body }
        if (req.params.id) tp_receita.id = req.params.id

        try {
            existsOrError(tp_receita.descricao, "Descrição não informado")

            const tp_receitaFromDB = await app.db('tp_receitas')
                .where({ descricao: tp_receita.descricao }).first()
            if (!tp_receita.id) {
                notExistsOrError(tp_receitaFromDB, 'Tipo de receita já cadastrada')
            }
            tp_receita.descricao = tp_receita.descricao.charAt(0).toUpperCase() + tp_receita.descricao.substr(1, tp_receita.descricao.length).toLowerCase()
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (tp_receita.id) {
            app.db('tp_receitas')
                .update(tp_receita)
                .where({ id: tp_receita.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {

            app.db('tp_receitas')
                .insert(tp_receita)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Codigo da categoria não informado.')

            const receitas = await app.db('receitas')
                .where({ tp_receita_id: req.params.id })
            notExistsOrError(receitas, 'Tipo de receitas possui receitas')

            const rowDelete = await app.db('tp_receitas')
                .where({ id: req.params.id }).del()
            existOrError(rowDelete, 'Tipo de receitas não foi encontrada')

            res.status(204).send()


        } catch (msg) {

            return res.status(400).send(msg)
        }
    }
    const get = (req, res) => {
        app.db('tp_receitas')
            .select()
            .then(tp_receitas => res.json(tp_receitas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('tp_receitas')
            .where({ id: req.params.id })
            .first()
            .then(tp_receitas => res.json(tp_receitas))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}