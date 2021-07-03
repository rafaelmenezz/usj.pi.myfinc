const { json } = require("express")

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const save = (req, res) => {
        const receita = { ...req.body }
        if (req.params.id) receita.id = req.params.id

        try {
            existsOrError(receita.valor, 'Valor não informado')
            existsOrError(receita.forma_recebimento, 'Forma de recebimento não informado')
            existsOrError(receita.local, 'Local não informado')
            existsOrError(receita.tipo.id, 'Tipo de receita não informado')
            existsOrError(req.params.usuario_id, 'Usuário não informado')
            receita.usuario_id = req.params.usuario_id
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (receita.id) {
            app.db('receitas')
                .update({
                    valor: receita.valor,
                    forma_recebimento: receita.forma_recebimento,
                    local: receita.local,
                    tp_receita_id: receita.tipo.id,
                    usuario_id: req.params.usuario_id
                })
                .where({ id: receita.id }).andWhere({ usuario_id: receita.usuario_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err.message))
        } else {
            app.db('receitas')
                .insert({
                    valor: receita.valor,
                    forma_recebimento: receita.forma_recebimento,
                    local: receita.local,
                    tp_receita_id: receita.tipo.id,
                    usuario_id: req.params.usuario_id
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err.message))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('receitas')
                .where({ id: req.params.id }).andWhere({ usuario_id: req.params.usuario_id }).del()

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }
   
    const get = async (req, res) => {
        const limit = 10
        const page = req.query.page || 1

        const resultCont = await app.db('receitas').count('id').where({ usuario_id: req.params.usuario_id }).first()
        const count = parseInt(resultCont['count'])
        try {
            const resultReceitas = await app.db('receitas')
                .where({ usuario_id: req.params.usuario_id })
                .limit(limit).offset(page * limit - limit)
            let receitas = resultReceitas

            for (let index = 0; index < receitas.length; index++) {
                let result = await app.db('tp_receitas').where({ id: receitas[index].tp_receita_id }).first()
                receitas[index].tipo = result
                delete receitas[index].tp_receita_id
            }

            res.json({ data: receitas, count, limit })
        } catch (error) {
            res.status(500).send(error)
        }

    }


    const getById = async (req, res) => {
       
        try {
            let receita
            const result = await app.db('receitas')
                .join('tp_receitas', 'receitas.tp_receita_id', 'tp_receitas.id')
                .select('receitas.id', 'receitas.valor', 'receitas.forma_recebimento', 'tp_receitas.id as tp_receita_id', 'tp_receitas.descricao'
                    , 'receitas.local', 'receitas.data')
                .where('receitas.id', req.params.id).andWhere('usuario_id', req.params.usuario_id)
                .first()
          
            receita = result
            receita.tipo = {id : receita.tp_receita_id, descricao: receita.descricao}
            delete receita.tp_receita_id
            delete receita.descricao

            res.json(receita)
        } catch (error) {
            res.status(500).send(error)
        }

}
const getByMes = async (req, res) => {
    const limit = 10
    const page = req.query.page || 1

    const resultCont = await app.db('receitas').count('id').where({ usuario_id: req.params.usuario_id }).first()
    const count = parseInt(resultCont['count'])

    if (req.params.data) {
        let ano = req.params.data.split("-")[0]
        let mes = req.params.data.split("-")[1]

        try {
            let receitas = await app.db('receitas')
            .whereRaw('EXTRACT(year FROM data ) = ' + ano + ' AND EXTRACT(month FROM data) = ' + mes + ' AND usuario_id = ' + req.params.usuario_id)
 
            for (let index = 0; index < receitas.length; index++) {
                let result = await app.db('tp_receitas').where({ id: receitas[index].tp_receita_id }).first()
                receitas[index].tipo = result
                delete receitas[index].tp_receita_id
            }
            res.json({ data: receitas, count, limit })
        } catch (error) {
            res.status(500).send(error.message)
        }  
    }

}

return { save, get, getById, remove, getByMes }
}