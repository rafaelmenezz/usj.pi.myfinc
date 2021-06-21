module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const save = async (req, res) => {
        const tpDespesa = { ...req.body }
        if(req.params.id) tpDespesa.id = req.params.id

        try {
            existsOrError(tpDespesa.descricao, "Descrição não informada")

            const tpDespesaFromDB = await app.db('tpDespesas')
            .where({descricao: tpDespesa.descricao}).first()
             if(!tpDespesa.id){ 
                 notExistsOrError(tpDespesaFromDB, 'Tipo de despesa já cadastrada')
             }   

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(tpDespesa.id){
            app.db('tpDespesas')
                .update(tpDespesa)
                .where({id : tpDespesa.id})
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
        
            app.db('tpDespesas')
                .insert(tpDespesa)
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
        
        
    }
    
    const remove = async (req, res) => {
        try {
            existsOrError( req.params.id, 'Codigo da despesa não informado.')

            const receitas = await app.db('despesas')
                .where({tpDespesaId : req.params.id})
            notExistsOrError(receitas, 'Tipo de despesa possui despesas cadastradas')
            
            const rowDelete = await app.db('tpDespesas')
                .where({id: req.params.id}).del()
            existOrError(rowDelete, 'Tipo de despesa não foi encontrada')

            res.status(204).send()

            
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }
     const get = (req, res) => {
         app.db('tpDespesas')
            .select()
            .then(tpDespesas => res.json(tpDespesas))
            .catch(err => res.status(500).send(err))
     }

     const getById = (req, res) => {
         app.db('tpDespesas')
            .where({ id: req.params.id})
            .first()
            .then(tpDespesas => res.json(tpDespesas))
            .catch(err => res.status(500).send(err))
     }

     return {save, remove, get, getById}
}