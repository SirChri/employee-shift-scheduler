const sequelize = require('./sequelize');
const { QueryTypes } = require('sequelize');
const express = require('express');
const router = express.Router();

router.get('/timeline-event', function(req, res, next) {
    var params = req.query;

    if (params.id) {
        sequelize.query(
            `SELECT 
                a.*, 
                c."name" "customer_descr",
                e."color"
            FROM "event" a
            LEFT JOIN customer c on a.customer_id = c.id
            LEFT JOIN employee e on a.employee_id = e.id
            WHERE a.id = :id`, {
                replacements: params,
                type: QueryTypes.SELECT
            }).then((data, meta) => {
            res.status(200).json(data[0])
        }).catch(err => {
            return res.status(500).send({ message: err })
        })
    } else {
        if (params.groups != "all") {
            params.groups = `{${params.groups}}`;

            sequelize.query(
                `SELECT 
                    a.*, 
                    c."name" "customer_descr",
                    e."color"
                FROM "event" a
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
                FROM "event" a
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
}
});


/**
 * get hours used over available per time range
 */
router.get('/timeline-event-hrs', function(req, res, next) {
    var params = req.query;

    sequelize.query(
        `SELECT 
            e.id, e.fullname, e.color, e.weekhrs, sum(coalesce(a.hours, 0))
        FROM employee e
        LEFT JOIN event a on a.employee_id = e.id AND ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end))
        WHERE e.active
        GROUP BY e.id, e.fullname, e.color, e.weekhrs`, {
            replacements: params,
            type: QueryTypes.SELECT
        }).then((data, meta) => {
        res.status(200).json(data)
    }).catch(err => {
        return res.status(500).send({ message: err })
    })
});

module.exports = router;