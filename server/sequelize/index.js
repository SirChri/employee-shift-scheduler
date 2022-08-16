const { Sequelize } = require('sequelize');
const { applyRelations } = require("./extra-setup");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER_PW, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


const modelDefiners = [
    require('./models/agenda.model'),
    require('./models/employee.model'),
    require('./models/customer.model'),
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