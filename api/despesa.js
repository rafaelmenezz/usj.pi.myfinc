module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = (req, res) => {
        const despesa = { ...req.body }
        if (req.params.id) despesa.id = req.params.id

        try {
            existsOrError(despesa.valor, 'Valor não informado')
            existsOrError(despesa.formaPagamento, 'Forma de recebimento não informado')
            existsOrError(despesa.local, 'Local não informado')
            existsOrError(despesa.tpDespesaId, 'Tipo de despesa não informado')
            existsOrError(req.params.usuarioId, 'Usuário não informado')
            despesa.usuarioId = req.params.usuarioId
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (despesa.id) {
            app.db('despesas')
                .update(despesa)
                .where({ id: despesa.id }).andWhere({ usuarioId: despesa.usuarioId })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            console.log(despesa)
            app.db('despesas')
                .insert({
                    valor: despesa.valor,
                    formaPagamento: despesa.formaPagamento,
                    local: despesa.local,
                    tpDespesaId: despesa.tpDespesaId,
                    usuarioId: req.params.usuarioId
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('despesas')
                .where({ id: req.params.id }).andWhere({ usuarioId: req.params.usuarioId }).del()

            res.status(204).send('ok')
        } catch (msg) {
            res.status(500).send(msg)
        }
    }
    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('despesas').count('id').where({ usuarioId: req.params.usuarioId }).first()
        const count = parseInt(result['count(`id`)'])

        app.db('despesas')
            .join('tpDespesas', 'despesas.tpDespesaId', 'tpDespesas.id')
            .select('despesas.id', 'despesas.valor', 'despesas.formaPagamento', 'despesas.tpDespesaId', 'tpDespesas.descricao'
                , 'despesas.local', 'despesas.data')
            .where({ usuarioId: req.params.usuarioId })
            .limit(limit).offset(page * limit - limit)
            .then(despesas => res.json({ data: despesas, count, limit }))
            .catch(err => res.status(500).send(err))
    }


    const getById = (req, res) => {
        app.db('despesas')
            .join('tpDespesas', 'despesas.tpDespesaId', 'tpDespesas.id')
            .select('despesas.id', 'despesas.valor', 'despesas.formaPagamento', 'despesas.tpDespesaId', 'tpDespesas.descricao'
                , 'despesas.local', 'despesas.data')
            .where('despesas.id', req.params.id).andWhere('usuarioId', req.params.usuarioId)
            .first()
            .then(despesas => res.json(despesas))
            .catch(err => res.status(500).send(err))
    }

    const getByMes = (req, res) => {

        if (req.params.data) {

            let ano = req.params.data.split("-")[0]
            let mes = req.params.data.split("-")[1]
            app.db('despesas')
                .join('tpDespesas', 'despesas.tpDespesaId', 'tpDespesas.id')
                .select('despesas.id', 'despesas.valor', 'despesas.formaPagamento', 'despesas.tpDespesaId', 'tpDespesas.descricao'
                    , 'despesas.local', 'despesas.data')
                .whereRaw('YEAR(Data) = ' + ano + ' AND MONTH(Data) = ' + mes + ' AND usuarioId = ' + req.params.usuarioId)
                .then(despesas => res.json(despesas))
                .catch(err => res.status(500).send(err))
        }

    }

    return { save, get, getById, remove, getByMes }
}