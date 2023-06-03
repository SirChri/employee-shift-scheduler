const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { crud } = require('express-crud-router');
const sequelize = require('./sequelize');
const customRoutes = require('./customRoutes')
const auth = require('./session')
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
const { Op } = require("sequelize");
const { RRule, RRuleSet } = require('rrule');

const models = sequelize.models;
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();

// base api url
const baseApiUrl = "/api"

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
        table: 'session'
    })
}));
app.use(passport.session());

//protect all endpoints but those in `allowUrl`
const allowUrl = ['/session'];
const authenticationMiddleware = (whiteList = []) => (req, res, next) => {
    if (req.isAuthenticated() || whiteList.find(f => baseApiUrl + f == req.url)) {
        return next()
    }
    res.status(403).json({
        "message": "authentication is required to access this resource"
    });
}

app.use(authenticationMiddleware(allowUrl));

// We define the standard REST APIs for each route (if they exist).
const standardRoutes = {
    employee: models.employee,
    customer: models.customer,
    event: models.event,
    user: models.user,
    sysconfig: models.sysconfig
};

const utcDate = (date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
}

const recurrentDates = (e, start, end) => {
    const startDate = new Date(e?.start_date);
    let out = [];
    let rrule = new RRule({
        freq: e?.frequency,
        interval: e?.interval,
        dtstart: utcDate(startDate),
        until: e?.until == 1 && e?.until_date ? new Date(e?.until_date) : null,
        count: e?.until == 2 ? e?.until_occurrences : null,
        byweekday: e?.byweekday,
    });

    const rruleSet = new RRuleSet();
    rruleSet.rrule(
        rrule
    );

    if (e.ex_dates)
        e.ex_dates?.forEach((d) => rruleSet.exdate(utcDate(new Date(d))))

    let i = 0;
    let duration = (new Date(e.end_date).getTime() - new Date(e.start_date).getTime());

    rruleSet.between(new Date(start), new Date(end))?.map((d) => new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
    )).forEach((d) => {
        let evt = { ...e };
        evt["id"] = e.id + "_" + i++;
        evt["start_date"] = new Date(d);
        evt["end_date"] = new Date(d.getTime() + duration);
        evt["_parent"] = e;
        evt["_original_start_date"] = new Date(d);

        out.push(evt);
    })

    return out;
}

for (const [routeName, routeController] of Object.entries(standardRoutes)) {
    app.use(
        crud(`${baseApiUrl}/${routeName}`, {
            getList: async ({ filter, limit, offset, order, opts }) => {
                let ops = {
                    "=": Op.eq,
                    "_gte": Op.gte,
                    "_lte": Op.lte,
                    "in": Op.in
                }

                let filters = [];
                var start, end;
                for (let key in filter) {
                    let element = filter[key];

                    let ft = {};
                    ft[ops[element["operator"]]] = element["value"];

                    let out = {};
                    out[element["field"]] = ft;

                    //for event only
                    if (routeName == 'event') {
                        if (element["field"] == 'start_date') {
                            start = element["value"]
                            continue;
                        } else if (element["field"] == 'end_date') {
                            end = element["value"]
                            continue;
                        }
                    }

                    filters.push(out);
                }

                
                if (routeName == 'event') {
                    /**
                     * required start and end filters
                     */
                    if (start == null || end == null) {
                        return { rows: [], count: 1 }
                    }
                    const rows = await routeController.findAll({
                        order,
                        include: [{
                            model: models.employee,
                            required: true
                        }, {
                            model: models.customer,
                            required: false
                        }],
                        /**
                         *           |-------------| (EVENT)
                         *      |---------|                 window.start < end_date && end_date < window.end
                         *                   |--------|     window.end > start_date && start_date > window.start
                         *      |---------------------|     window.start > start_date && window.end < end_date
                         * 
                         *                                  recurring && start_date < window.end && until_date > window.start
                         */
                        where: {
                            [Op.and]: [...filters, [{
                                [Op.and]: [sequelize.literal(
                                    '(recurring AND start_date <= :end AND (CASE WHEN until_date IS NOT NULL THEN until_date >= :start ELSE true END)) OR '+
                                    '(NOT coalesce(recurring, false) AND :start <= end_date AND end_date <= :end) OR'+
                                    '(NOT coalesce(recurring, false) AND :end >= start_date AND start_date >= :start) OR'+
                                    '(NOT coalesce(recurring, false) AND :start >= start_date AND :end <= end_date)'
                                )]
                            }]
                            ]
                        },
                        replacements: {
                            start, end
                        }
                    })

                    var data = rows.map((e) => e.dataValues)

                    // get recurring events
                    var recurrentEvs = [];
                    data.filter((e) => e.recurring)?.forEach((e) => {
                        recurrentEvs = recurrentEvs.concat(recurrentDates(e, start, end));
                    })

                    const sortattr = order[0][0];
                    const sortdir = order[0][1];

                    var out = [...data.filter((e) => !e.recurring), ...recurrentEvs];
                    out = out.sort((a, b) => sortdir == 'ASC' ? (a[sortattr] < b[sortattr]) - (a[sortattr] > b[sortattr]) : (a[sortattr] > b[sortattr]) - (a[sortattr] < b[sortattr]));

                    return { rows: out.slice(offset,offset+limit), count: out.length }
                }

                const { rows, count } = await routeController.findAndCountAll({
                    limit, offset, order, where: filters && filters.length > 0 ? {
                        [Op.and]: filters
                    } : null
                })

                return { rows, count }
            },
            getOne: (id) => routeController.findByPk(id),
            create: (body) =>
                routeController.create(body),
            update: (id, body) => {
                const r = routeController.update(body, { where: { id }, individualHooks: true });
                return body;
            },
            destroy: (id) => routeController.destroy({ where: { id } }),
        }))
}

//custom routes
app.use(baseApiUrl, customRoutes);
app.use(baseApiUrl, auth);

module.exports = app;
