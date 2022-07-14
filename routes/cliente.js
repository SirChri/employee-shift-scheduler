var express = require('express');
var router = express.Router();
const pool = require('./pgconfig');


router.get('/', function(req, res, next) {
    pool.query('SELECT * FROM "Cliente" ORDER BY nome ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json({ data: results.rows })
    })
});

router.post('/', function(req, res, next) {
    const { nome, indirizzo } = req.body

    pool.query('INSERT INTO "Cliente" (nome, indirizzo) VALUES ($1, $2) RETURNING *', [nome, indirizzo], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send({
            id: results.rows[0].id
        })
    })
});

module.exports = router;