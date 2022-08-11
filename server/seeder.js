async function seeder(sequelize) {
    const { user } = sequelize.models;

    await user.findOrCreate({
        where: { name: 'admin' },
        defaults: {
            password: "admin",
            email: "admin@example.com"
        }
    });
}

module.exports = { seeder };