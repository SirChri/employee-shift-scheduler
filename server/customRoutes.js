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
            JOIN employee e on a.employee_id = e.id
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
                    e."color",
                    e."fullname" "employee_descr"
                FROM "event" a
                LEFT JOIN customer c on a.customer_id = c.id
                JOIN employee e on a.employee_id = e.id AND e.deleted_at IS NULL
                WHERE employee_id = ANY (:groups ::bigint[]) AND ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end)) AND a.deleted_at IS NULL AND NOT a.recurring
                UNION
                SELECT 
                    a.*, 
                    c."name" "customer_descr",
                    e."color",
                    e."fullname" "employee_descr"
                FROM "event" a
                LEFT JOIN customer c on a.customer_id = c.id
                JOIN employee e on a.employee_id = e.id AND e.deleted_at IS NULL
                WHERE employee_id = ANY (:groups ::bigint[]) AND a.deleted_at IS NULL AND a.recurring`, {
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
                    e."color",
                    e."fullname" "employee_descr"
                FROM "event" a
                LEFT JOIN customer c on a.customer_id = c.id
                JOIN employee e on a.employee_id = e.id AND e.deleted_at IS NULL
                WHERE ((end_date BETWEEN :start AND :end) OR (start_date BETWEEN :start AND :end) OR (start_date < :start AND end_date > :end)) AND a.deleted_at IS NULL AND NOT a.recurring
                UNION
                SELECT 
                    a.*, 
                    c."name" "customer_descr",
                    e."color",
                    e."fullname" "employee_descr"
                FROM "event" a
                LEFT JOIN customer c on a.customer_id = c.id
                JOIN employee e on a.employee_id = e.id AND e.deleted_at IS NULL
                WHERE a.deleted_at IS NULL AND a.recurring`, {
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
 * 
 */
router.post('/recurring-event', function(req, res, next) {
    var data = req.body;

    switch(data.type) {
        case 0: //this event only  
            sequelize.query(
                `SELECT 
                    a.*, 
                    c."name" "customer_descr",
                    e."color",
                    e."fullname" "employee_descr"
                FROM "event" a
                LEFT JOIN customer c on a.customer_id = c.id
                JOIN employee e on a.employee_id = e.id
                WHERE a.id = :id`, {
                    replacements: params,
                    type: QueryTypes.INSERT
                }).then((data, meta) => {
                res.status(200).json(data[0])
            }).catch(err => {
                return res.status(500).send({ message: err })
            })
            break;
        case 1: //this and following events
            
            break;
        case 2: //all events
            
            break;
        default:
            // unhandled type
    }
    if (params.id) {
        sequelize.query(
            `SELECT 
                a.*, 
                c."name" "customer_descr",
                e."color",
                e."fullname" "employee_descr"
            FROM "event" a
            LEFT JOIN customer c on a.customer_id = c.id
            JOIN employee e on a.employee_id = e.id
            WHERE a.id = :id`, {
                replacements: params,
                type: QueryTypes.INSERT
            }).then((data, meta) => {
            res.status(200).json(data[0])
        }).catch(err => {
            return res.status(500).send({ message: err })
        })
    }
})

module.exports = router;