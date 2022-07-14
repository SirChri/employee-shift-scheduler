var express = require('express');
var router = express.Router();
const pool = require('./pgconfig');

router.get('/', function(req, res, next) {
    var params = req.query;
    var query = `SELECT *, (SELECT "nome" FROM "Cliente" WHERE id = a.cliente) "cliente_descr"
    FROM "Agenda" a
    WHERE dipendente IN (SELECT unnest('{${params.groups}}'::BIGINT[])) AND ((data_fine BETWEEN '${params.start}' AND '${params.end}') OR (data_inizio BETWEEN '${params.start}' AND '${params.end}') OR (data_inizio < '${params.start}' AND data_fine > '${params.end}'))`;

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
});

router.post('/', function(req, res, next) {
    const { dipendente, data_inizio, data_fine, cliente } = req.body

    pool.query('INSERT INTO "Agenda" (dipendente, data_inizio, data_fine, cliente) VALUES ($1, $2, $3, $4) RETURNING *', [dipendente == '' ? null : dipendente, data_inizio == '' ? null : data_inizio, data_fine == '' ? null : data_fine, cliente == '' ? null : cliente], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send({
            id: results.rows[0].id
        })
    })
});

module.exports = router;