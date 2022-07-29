const sequelize = require('./sequelize');
const {QueryTypes} = require('sequelize');
const express = require('express');
const router = express.Router();

router.get('/timeline-agenda', function(req, res, next) {
    var params = req.query;
    params.groups = `{${params.groups}}`;

    sequelize.query(
        `SELECT *, (SELECT "descrizione" FROM "cliente" WHERE id = a.cliente_id) "cliente_descr"
        FROM "agenda" a
        WHERE  dipendente_id = ANY (:groups ::bigint[]) AND ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end))`,
        {
          replacements: params,
          type: QueryTypes.SELECT
        }).then((data, meta) => {
            res.status(200).json(data)
        }).catch(err => {
            return res.status(500).send({message: err})
        })
});

module.exports = router;