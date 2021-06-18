const express = require('express')
const router = express.Router()

const mysql = require('../config/mysql').pool;



router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `SELECT D.id_despesa , D.valor, D.forma_pagamento, TD.descricao, D.local, D.data, D.usuario  
            FROM despesas as D 
            INNER JOIN 
            tipo_despesas as TD
            ON D.tipo_despesa = TD.id_tipo_despesa`,
            (error, resultado, fields) =>{
                conn.release()
                if(error){ return res.status(500).send({error : error})}
                return res.status(200).send(resultado)
            }
        )

    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'INSERT INTO despesas (valor, forma_pagamento, tipo_despesa, local, usuario) VALUES (?, ?, ?, ?, ?);', 
            [req.body.valor, req.body.forma_pagamento, req.body.tipo_despesa, req.body.local, req.body.usuario],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(201).send({
                    mensagem: 'Despesas cadastrada com sucesso!',
                    id_despesa: resultado.insertId
                })
            }
        )
        
    })
  
})

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `SELECT D.id_despesa , D.valor, D.forma_pagamento, TD.descricao, D.local, D.data, D.usuario  
            FROM despesas as D 
            INNER JOIN 
            tipo_despesas as TD
            ON D.tipo_despesa = TD.id_tipo_despesa
            WHERE D.id_despesa =  ?`,
            [req.params.id],
            (error, resultado, fields) =>{
                conn.release();
                if (error) {
                    return res.status(500).send({
                      error: error,
                       response: null
                   })
                   
               }
               res.status(201).send( resultado[0])
           }
            
        )

    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `UPDATE despesas
                SET valor               = ?,
                    forma_pagamento     = ?,
                    tipo_despesa        = ?,
                    local               = ?
                WHERE id_despesa        = ? 
                AND   usuario           = ?`, 
            [req.body.valor, req.body.forma_recebimento, req.body.tipo_receita, req.body.local, req.body.id_receita, req.body.usuario],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(202).send({
                    mensagem: 'Dados da despesa alterado com sucesso!',
                    
                })
            }
        )
        
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `DELETE FROM despesas WHERE id_despesa = ? `, [req.body.id],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                }
                res.status(202).send({
                    mensagem: 'Dados da despesas removida com sucesso',
                })
            }
        )
        
    })
})
module.exports = router