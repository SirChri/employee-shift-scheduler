const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const sequelize = require('./sequelize');
const { seeder } = require('./seeder');

const PORT = process.env.NODE_DOCKER_PORT || 5555;

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await seeder(sequelize);
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function init() {
    await assertDatabaseConnectionOk();

    console.log(`Starting Sequelize + Express example on port ${PORT}...`);

    app.listen(PORT, () => {
        console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
    });
}

init();