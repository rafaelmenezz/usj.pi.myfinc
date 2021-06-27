module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = (req, res) => {
        const receita = { ...req.body }
        if (req.params.id) receita.id = req.params.id

        try {
            existsOrError(receita.valor, 'Valor não informado')
            existsOrError(receita.formaRecebimento, 'Forma de recebimento não informado')
            existsOrError(receita.local, 'Local não informado')
            existsOrError(receita.tpReceitaId, 'Tipo de receita não informado')
            existsOrError(req.params.usuarioId, 'Usuário não informado')
            receita.usuarioId = req.params.usuarioId
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (receita.id) {
            app.db('receitas')
                .update(receita)
                .where({ id: receita.id }).andWhere({usuarioId: receita.usuarioId})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            console.log(receita)
            app.db('receitas')
                .insert({
                    valor: receita.valor,
                    formaRecebimento: receita.formaRecebimento,
                    local: receita.local,
                    tpReceitaId: receita.tpReceitaId,
                    usuarioId: req.params.usuarioId
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('receitas')
                .where({ id: req.params.id }).andWhere({ usuarioId: req.params.usuarioId }).del()

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }
    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('receitas').count('id').where({ usuarioId: req.params.usuarioId }).first()
        const count = parseInt(result['count(`id`)'])

        app.db('receitas')
            .join('tpReceitas', 'receitas.tpReceitaId', 'tpReceitas.id')
            .select('receitas.id', 'receitas.valor', 'receitas.formaRecebimento', 'tpReceitas.id as tpReceitaId', 'tpReceitas.descricao'
                , 'receitas.local', 'receitas.data')
            .where({ usuarioId: req.params.usuarioId })
            .limit(limit).offset(page * limit - limit)
            .then(receitas => res.json({ data: receitas, count, limit }))
            .catch(err => res.status(500).send(err))
    }


    const getById = (req, res) => {
        app.db('receitas')
            .join('tpReceitas', 'receitas.tpReceitaId', 'tpReceitas.id')
            .select('receitas.id', 'receitas.valor', 'receitas.formaRecebimento','tpReceitas.id as tpReceitaId' ,'tpReceitas.descricao'
                , 'receitas.local', 'receitas.data')
            .where('receitas.id', req.params.id).andWhere('usuarioId', req.params.usuarioId)
            .first()
            .then(receitas => res.json(receitas))
            .catch(err => res.status(500).send(err))
    }
    const getByMes = (req, res) => {

        if (req.params.data) {
  
            let ano = req.params.data.split("-")[0]
            let mes = req.params.data.split("-")[1]
            app.db('receitas')
            .join('tpReceitas', 'receitas.tpReceitaId', 'tpReceitas.id')
            .select('receitas.id', 'receitas.valor', 'receitas.formaRecebimento', 'tpReceitas.descricao'
                , 'receitas.local', 'receitas.data')
            .whereRaw('YEAR(Data) = '+ ano +' AND MONTH(Data) = '+ mes +' AND usuarioId = '  + req.params.usuarioId)
            .then(receitas => res.json(receitas))
            .catch(err => res.status(500).send(err))
        }
      
    }

    return { save, get, getById, remove, getByMes }
}