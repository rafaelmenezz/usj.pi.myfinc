module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const save = (req, res) => {
        const despesa = { ...req.body }
        if(req.params.id) despesa.id = req.params.id

        try {
            existsOrError(despesa.valor, 'Valor não informado')
            existsOrError(despesa.formaPagamento, 'Forma de pagamento não informado')
            existsOrError(despesa.local, 'Local não informado')
            existsOrError(despesa.tpDespesaId, 'Tipo de despesa não informado')
            existsOrError(despesa.usuarioId, 'Usuário não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(despesa.id){
            app.db('despesas')
                .update(despesa)
                .where({id:despesa.id})
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
            app.db('despesas')
                .insert({valor : despesa.valor, 
                        formaPagamento : despesa.formaPagamento,
                        local: despesa.local, 
                        tpDespesaId: despesa.tpDespesaId,
                        usuarioId : despesa.usuarioId})
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('despesas')
                .where({id:req.params.id}).del()
                notExistsOrError(rowsDeleted, 'Receita não foi encontrada')
                
                res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }
    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('despesas').count('id').first()
        const count = parseInt(result['count(`id`)'])

        app.db('despesas')
            .join('tpDespesas', 'despesas.tpDespesaId', 'tpDespesas.id')
            .select('despesas.id', 'despesas.valor', 'despesas.formaPagamento', 'tpDespesas.descricao'
            ,'despesas.local', 'despesas.data')
            .limit(limit).offset(page * limit - limit)
            .then(despesas => res.json({ data: despesas, count, limit}))
            .catch(err => res.status(500).send(err))
    }
    

    const getById = (req, res) => {
        app.db('despesas')
            .where({id: req.params.id})
            .first()
            .then(despesas => res.json(despesas))
            .catch(err => res.status(500).send(err))
    }

    return {save, get, getById, remove}
}