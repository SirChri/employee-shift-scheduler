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
    agenda: models.agenda,
    user: models.user,
    sysconfig: models.sysconfig
};

for (const [routeName, routeController] of Object.entries(standardRoutes)) {
    app.use(
        crud(`${baseApiUrl}/${routeName}`, {
            getList: ({ filter, limit, offset, order, opts  }) => {
                /*console.log("rrrr ", opts)

                const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' };
                console.log("xxx ", filter)
                let where = {};

                const filters = Object.keys(filter).map(key => {
                    const operator = operators[key.slice(-4)];
                    const seqOp = operator ? Op[operator] : Op.and;
                    const field = operator ? key.slice(0, -4) : key;
                    where[field] = {
                        [seqOp]: filter[key]
                    };

                    return key;
                });
                console.log("yyy ", where)*/

                return routeController.findAndCountAll({ limit, offset, order, where: filter })
            },
            getOne: (id) => routeController.findByPk(id),
            create: (body) =>
                routeController.create(body),
            update: (id, body) => {
                const r = routeController.update(body, { where: { id } });
                return body;
            },
            destroy: (id) => routeController.destroy({ where: { id } }),
        }))
}

//custom routes
app.use(baseApiUrl, customRoutes);
app.use(baseApiUrl, auth);

module.exports = app;
