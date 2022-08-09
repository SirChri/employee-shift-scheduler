const { Sequelize } = require('sequelize');
const { applyRelations } = require("./extra-setup")

const sequelize = new Sequelize(process.env.DB_STRING)

const modelDefiners = [
    require('./models/agenda.model'),
    require('./models/dipendente.model'),
    require('./models/cliente.model'),
    require('./models/session.model'),
    require('./models/user.model')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyRelations(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;