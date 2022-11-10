const sequelize = require('./sequelize');
const { QueryTypes } = require('sequelize');
const express = require('express');
const router = express.Router();

router.get('/timeline-agenda', function(req, res, next) {
    var params = req.query;

    if (params.groups != "all") {
        params.groups = `{${params.groups}}`;

        sequelize.query(
            `SELECT 
                a.*, 
                c."name" "customer_descr",
                e."color"
            FROM "agenda" a
            LEFT JOIN customer c on a.customer_id = c.id
            LEFT JOIN employee e on a.employee_id = e.id
            WHERE employee_id = ANY (:groups ::bigint[]) AND ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end))`, {
                replacements: params,
                type: QueryTypes.SELECT
            }).then((data, meta) => {
            res.status(200).json(data)
        }).catch(err => {
            return res.status(500).send({ message: err })
        })
    } else {
        sequelize.query(
            `SELECT 
                a.*, 
                c."name" "customer_descr",
                e."color"
            FROM "agenda" a
            LEFT JOIN customer c on a.customer_id = c.id
            LEFT JOIN employee e on a.employee_id = e.id
            WHERE ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end))`, {
                replacements: params,
                type: QueryTypes.SELECT
            }).then((data, meta) => {
            res.status(200).json(data)
        }).catch(err => {
            return res.status(500).send({ message: err })
        })
    }
});

module.exports = router;