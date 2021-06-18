const express = require('express')
const router = express.Router()

const mysql = require('../mysql').pool;



router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'SELECT * FROM receita',
            (error, resultado, fields) =>{
                conn.release()
                if(error){ return res.status(500).send({error : error})}
                return res.status(200).send({response: resultado})
            }
        )

    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            'INSERT INTO usuario (nome, telefone, email, login, senha) VALUES (?, ?, ?, ?, ?);', 
            [req.body.nome, req.body.telefone, req.body.email, req.body.login, req.body.senha],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(201).send({
                    mensagem: 'Usuário inserido',
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
            'SELECT * FROM usuario WHERE id_usuario =  ?',
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
            `UPDATE receita
                SET nome        = ?,
                    telefone    = ?,
                    email       = ?,
                    login       = ?,
                    senha       = ?
                WHERE id_usuario = ?`, 
            [req.body.nome, req.body.telefone, req.body.email, req.body.login, req.body.senha, req.body.id],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                    
                }
                res.status(202).send({
                    mensagem: 'Dados do receita alterado com sucesso!',
                    
                })
            }
        )
        
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error : error})}
        conn.query(
            `DELETE FROM receita WHERE id_usuario = ? `, [req.body.id],
            (error, resultado, field) =>{
            conn.release()
            if (error) {
                     return res.status(500).send({
                       error: error,
                        response: null
                    })
                }
                res.status(202).send({
                    mensagem: 'Dados da receita removida com sucesso',
                })
            }
        )
        
    })
})
module.exports = router