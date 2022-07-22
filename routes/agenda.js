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
            return res.status(500).send({message: error})
        }
        res.status(200).json(results.rows)
    })
});

router.post('/', function(req, res, next) {
    const { dipendente, data_inizio, data_fine, cliente } = req.body
    
    if (!dipendente) return res.status(500).send({message: "Compilare il campo 'dipendente'"})
    if (!data_inizio) return res.status(500).send({message: "Compilare il campo 'data_inizio'"})
    if (!data_fine) return res.status(500).send({message: "Compilare il campo 'data_fine'"})
    if (!cliente) return res.status(500).send({message: "Compilare il campo 'cliente'"})

    if (new Date(data_inizio) > new Date(data_fine)) {
        return res.status(500).send({message: "Data fine deve essere maggiore alla data inizio."})
    }

    pool.query('INSERT INTO "Agenda" (dipendente, data_inizio, data_fine, cliente) VALUES ($1, $2, $3, $4) RETURNING *', [dipendente, data_inizio, data_fine, cliente], (error, results) => {
        if (error) {
            return res.status(500).send({message: error})
        }
        res.status(201).send({
            id: results.rows[0].id
        })
    })
});

router.put('/', function(req, res, next) {
    const { id, dipendente, cliente, data_inizio, data_fine } = req.body
    
    if (!dipendente) return res.status(500).send({message: "Compilare il campo 'dipendente'"})
    if (!data_inizio) return res.status(500).send({message: "Compilare il campo 'data_inizio'"})
    if (!data_fine) return res.status(500).send({message: "Compilare il campo 'data_fine'"})
    if (!cliente) return res.status(500).send({message: "Compilare il campo 'cliente'"})

    if (new Date(data_inizio) > new Date(data_fine)) {
        return res.status(500).send({message: "Data fine deve essere maggiore alla data inizio."})
    }

    pool.query(`UPDATE "Agenda" SET (dipendente, data_inizio, data_fine, cliente) = ($1, $2, $3, $4) WHERE id = $5 RETURNING *`, [dipendente, data_inizio, data_fine, cliente, id], (error, results) => {
        if (error) {
            res.status(500).send({message: error})
        }
        res.status(201).send({
            id: results.rows[0].id
        })
    })
});

module.exports = router;