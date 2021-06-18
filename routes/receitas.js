const express = require('express')
const router = express.Router()

const mysql = require('../config/mysql').pool;



router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT R.id_receita, R.valor, R.forma_recebimento, TR.descricao, R.local, R.data, R.usuario  
            FROM receitas as R 
            INNER JOIN 
            tipo_receitas as TR
            ON R.tipo_receita = TR.id_tipo_receita`,
            (error, resultado, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send(resultado)
            }
        )

    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO receitas (valor, forma_recebimento, tipo_receita, local, usuario) VALUES (?, ?, ?, ?, ?);',
            [req.body.valor, req.body.forma_recebimento, req.body.tipo_receita, req.body.local, req.body.usuario],
            (error, resultado, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })

                }
                res.status(201).send({
                    mensagem: 'Receita cadastrada com sucesso!',
                    id_receita: resultado.insertId
                })
            }
        )

    })

})

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT R.id_receita, R.valor, R.forma_recebimento, TR.descricao, R.local, R.data, R.usuario  
            FROM receitas as R 
            INNER JOIN 
            tipo_receitas as TR
            ON R.tipo_receita = TR.id_tipo_receita
            WHERE R.id_receita = ?`,
            [req.params.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })

                }
                res.status(201).send(resultado[0])
            }

        )

    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE receitas
                SET valor               = ?,
                    forma_recebimento   = ?,
                    tipo_receita        = ?,
                    local               = ?
                WHERE id_receita        = ? 
                AND   usuario           = ?`,
            [req.body.valor, req.body.forma_recebimento, req.body.tipo_receita, req.body.local, req.body.id_receita, req.body.usuario],
            (error, resultado, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })

                }
                res.status(202).send({
                    mensagem: 'Dados da receita alterado com sucesso!',

                })
            }
        )

    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM receitas WHERE id_receita = ? `, [req.body.id],
            (error, resultado, field) => {
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