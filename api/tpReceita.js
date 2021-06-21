module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const save = async (req, res) => {
        const tpReceita = { ...req.body }
        if(req.params.id) tpReceita.id = req.params.id

        try {
            existsOrError(tpReceita.descricao, "Descrição não informado")
            
            const tpReceitaFromDB = await app.db('tpReceitas')
            .where({descricao: tpReceita.descricao}).first()
             if(!tpReceita.id){ 
                 notExistsOrError(tpReceitaFromDB, 'Tipo de receita já cadastrada')
             }   
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(tpReceita.id){
            app.db('tpReceitas')
                .update(tpReceita)
                .where({id : tpReceita.id})
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
        
            app.db('tpReceitas')
                .insert(tpReceita)
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
        
        
    }
    
    const remove = async (req, res) => {
        try {
            existsOrError( req.params.id, 'Codigo da categoria não informado.')

            const receitas = await app.db('receitas')
                .where({tpReceitaId : req.params.id})
            notExistsOrError(receitas, 'Tipo de receitas possui receitas')
            
            const rowDelete = await app.db('tpReceitas')
                .where({id: req.params.id}).del()
            existOrError(rowDelete, 'Tipo de receitas não foi encontrada')

            res.status(204).send()

            
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }
     const get = (req, res) => {
         app.db('tpReceitas')
            .select()
            .then(tpReceitas => res.json(tpReceitas))
            .catch(err => res.status(500).send(err))
     }

     const getById = (req, res) => {
         app.db('tpReceitas')
            .where({ id: req.params.id})
            .first()
            .then(tpReceitas => res.json(tpReceitas))
            .catch(err => res.status(500).send(err))
     }

     return {save, remove, get, getById}
}