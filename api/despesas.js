module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = (req, res) => {
        const despesa = { ...req.body }
        if (req.params.id) despesa.id = req.params.id

        try {
            existsOrError(despesa.valor, 'Valor não informado')
            existsOrError(despesa.forma_pagamento, 'Forma de recebimento não informado')
            existsOrError(despesa.local, 'Local não informado')
            existsOrError(despesa.tipo.id, 'Tipo de despesa não informado')
            existsOrError(req.params.usuario_id, 'Usuário não informado')
            despesa.usuario_id = req.params.usuario_id
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (despesa.id) {
            app.db('despesas')
                .update({
                    valor: despesa.valor,
                    forma_pagamento: despesa.forma_pagamento,
                    local: despesa.local,
                    tp_despesa_id: despesa.tipo.id,
                    usuario_id: req.params.usuario_id
                })
                .where({ id: despesa.id }).andWhere({ usuario_id: despesa.usuario_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            console.log(despesa)
            app.db('despesas')
                .insert({
                    valor: despesa.valor,
                    forma_pagamento: despesa.forma_pagamento,
                    local: despesa.local,
                    tp_despesa_id: despesa.tipo.id,
                    usuario_id: req.params.usuario_id
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('despesas')
                .where({ id: req.params.id }).andWhere({ usuario_id: req.params.usuario_id }).del()

            res.status(204).send('ok')
        } catch (msg) {
            res.status(500).send(msg)
        }
    }
  
    const get = async (req, res) => {
        const limit = 10
        const page = req.query.page || 1

        const resultCont = await app.db('despesas').count('id').where({ usuario_id: req.params.usuario_id }).first()
        const count = parseInt(resultCont['count'])
        try {
            const resultDespesas = await app.db('despesas')
                .where({ usuario_id: req.params.usuario_id })
                .limit(limit).offset(page * limit - limit)
            let despesas = resultDespesas

            for (let index = 0; index < despesas.length; index++) {
                let result = await app.db('tp_despesas').where({ id: despesas[index].tp_despesa_id }).first()
                despesas[index].tipo = result
                delete despesas[index].tp_despesa_id
            }

            res.json({data: despesas, count, limit })
        } catch (error) {
            res.status(500).send(error)
        }
    }


    const getById = async (req, res) => {
        try {
            let despesa
            const result = await app.db('despesas')
                .join('tp_despesas', 'despesas.tp_despesa_id', 'tp_despesas.id')
                .select('despesas.id', 'despesas.valor', 'despesas.forma_pagamento', 'tp_despesas.id as tp_despesa_id', 'tp_despesas.descricao'
                    , 'despesas.local', 'despesas.data')
                .where('despesas.id', req.params.id).andWhere('usuario_id', req.params.usuario_id)
                .first()
          
                despesa = result
                despesa.tipo = {id : despesa.tp_receita_id, descricao: despesa.descricao}
            delete despesa.tp_despesa_id
            delete despesa.descricao

            res.json(despesa)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const getByMes = async (req, res) => {
        const limit = 10
        const page = req.query.page || 1

        const resultCont = await app.db('despesas').count('id').where({ usuario_id: req.params.usuario_id }).first()
        const count = parseInt(resultCont['count'])

        if (req.params.data) {
            let ano = req.params.data.split("-")[0]
            let mes = req.params.data.split("-")[1]
    
            try {
                let despesas = await app.db('despesas')
                .whereRaw('EXTRACT(year FROM data ) = ' + ano + ' AND EXTRACT(month FROM data) = ' + mes + ' AND usuario_id = ' + req.params.usuario_id)
     
                for (let index = 0; index < despesas.length; index++) {
                    let result = await app.db('tp_despesas').where({ id: despesas[index].tp_despesa_id }).first()
                    despesas[index].tipo = result
                    delete despesas[index].tp_despesa_id
                }
                res.json({data: despesas, count, limit })
            } catch (error) {
                res.status(500).send(error)
            }  
        }

    }

    return { save, get, getById, remove, getByMes }
}