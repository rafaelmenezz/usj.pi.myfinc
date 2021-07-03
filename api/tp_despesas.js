module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = async (req, res) => {
        const tp_despesa = { ...req.body }
        if (req.params.id) tp_despesa.id = req.params.id

        try {
            existsOrError(tp_despesa.descricao, "Descrição não informada")

            const tp_despesaFromDB = await app.db('tp_despesas')
                .where({ descricao: tp_despesa.descricao }).first()
            if (!tp_despesa.id) {
                notExistsOrError(tp_despesaFromDB, 'Tipo de despesa já cadastrada')
            }
            tp_despesa.descricao = tp_despesa.descricao.charAt(0).toUpperCase() + tp_despesa.descricao.substr(1, tp_despesa.descricao.length).toLowerCase()
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (tp_despesa.id) {
            app.db('tp_despesas')
                .update(tp_despesa)
                .where({ id: tp_despesa.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {

            app.db('tp_despesas')
                .insert(tp_despesa)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Codigo da despesa não informado.')

            const depesas = await app.db('despesas')
                .where({ tp_despesa_id: req.params.id })
            notExistsOrError(depesas, 'Tipo de despesa possui despesas cadastradas')

            const rowDelete = await app.db('tp_despesas')
                .where({ id: req.params.id }).del()
            existOrError(rowDelete, 'Tipo de despesa não foi encontrada')

            res.status(204).send()


        } catch (msg) {
            return res.status(400).send(msg)
        }
    }
    const get = (req, res) => {
        app.db('tp_despesas')
            .select()
            .then(tp_despesas => res.json(tp_despesas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('tp_despesas')
            .where({ id: req.params.id })
            .first()
            .then(tp_despesas => res.json(tp_despesas))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}