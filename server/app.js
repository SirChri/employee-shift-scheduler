const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { crud } = require('express-crud-router');
const { models } = require('./sequelize');
const customRoutes = require('./customRoutes')

const standardRoutes = {
    dipendente: models.dipendente,
    cliente: models.cliente,
    agenda: models.agenda
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We provide a root route just as an example
app.get('/', (req, res) => {
    res.send(`
		<h2>Hello, Sequelize + Express!</h2>
		<p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
		<p>Try some routes, such as <a href='/api/users'>/api/users</a> or <a href='/api/orchestras?includeInstruments'>/api/orchestras?includeInstruments</a>!</p>
		<p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
	`);
});

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

module.exports = app;