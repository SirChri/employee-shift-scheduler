const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { crud } = require('express-crud-router');
const sequelize = require('./sequelize');
const customRoutes = require('./customRoutes')
const auth = require('./auth')
var logger = require('morgan');

const models = sequelize.models;

var passport = require('passport');
var session = require('express-session');

var SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(session({
    secret: 'porcodio',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
        table: 'session'
    })
}));
app.use(passport.session());

const standardRoutes = {
    dipendente: models.dipendente,
    cliente: models.cliente,
    agenda: models.agenda,
    user: models.user
};

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(standardRoutes)) {
    app.use(
        crud(`/api/${routeName}`, {
            getList: ({ filter, limit, offset, order }) =>
                routeController.findAndCountAll({ limit, offset, order, where: filter }),
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
app.use('/api/', customRoutes);
app.use('/api/', auth);

module.exports = app;