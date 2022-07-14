var express = require('express');
var router = express.Router();
const pool = require('./pgconfig');


router.get('/', function(req, res, next) {
    pool.query('SELECT * FROM "Dipendente" ORDER BY cognome ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
});

router.get('/:id(\\d+)', function(req, res, next) {
    pool.query('SELECT * FROM "Dipendente" WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows[0])
    })
});

router.get('/resoconto', function(req, res, next) {
    var params = req.query,
        dipendente = params.dipendente || 0,
        dataFine = params.data_fine ? `data_fine <= '${params.data_fine}'` : 'true',
        dataInizio = params.data_inizio ? `data_inizio >= '${params.data_inizio}'` : 'true',
        query = `select ROUND((EXTRACT(epoch FROM data_fine - data_inizio)/3600)::numeric, 2) hours, data_inizio, data_fine, (SELECT "nome" FROM "Cliente" WHERE id = a.cliente) cliente_descr, cliente, id
        from "Agenda" a
        WHERE dipendente = ${dipendente} AND ${dataFine} AND ${dataInizio}
        order by data_inizio`;

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
});

router.post('/', function(req, res, next) {
    const { nome, cognome } = req.body

    pool.query('INSERT INTO "Dipendente" (nome, cognome) VALUES ($1, $2) RETURNING *', [nome, cognome], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send({
            id: results.rows[0].id
        })
    })
});

module.exports = router;