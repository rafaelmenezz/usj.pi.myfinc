const express = require('express')
const router = express.Router()

const mysql = require('../config/mysql').pool;



router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'SELECT * FROM tipo_despesas',
            (error, usuarios, fields) =>{
                conn.release()
                if(error){ return res.status(500).send({error : error})}
                return res.status(200).send(usuarios)
            }
        )

    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'INSERT INTO tipo_despesas (descricao) VALUES (?);', 
            [req.body.descricao],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(201).send({
                    mensagem: 'Tipo de despesas inserido com sucesso!',
                    id_usuario: resultado.insertId
                })
            }
        )
        
    })
  
})

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'SELECT * FROM tipo_despesas WHERE id_tipo_despesa =  ?',
            [req.params.id],
            (error, resultado, fields) =>{
                conn.release();
                if (error) {
                    return res.status(500).send({
                      error: error,
                       response: null
                   })
                   
               }
               res.status(201).send({
                response: resultado
               })
           }
            
        )

    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `UPDATE tipo_despesas
                SET descricao        = ?
                WHERE id_tipo_despesa = ?`, 
            [req.body.descricao, req.body.id],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(202).send({
                    mensagem: 'Dados do despesa alterado com sucesso!',
                    
                })
            }
        )
        
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `DELETE FROM tipo_despesas WHERE id_tipo_despesa = ? `, [req.body.id],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                }
                res.status(202).send({
                    mensagem: 'Dados da despesa removido com sucesso!',
                })
            }
        )
        
    })
})
module.exports = router