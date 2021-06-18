const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando Get dentro da rota de receita'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o post dento da rota de receita'
    })
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        mensagem: id + ' esse é o id que você pesquisou '
    })
})

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando PATCH dentro da rota'
    })
})

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: id + ' Usando DELETE dentro da rota0'
    })
})
module.exports = router