function applyRelations(sequelize) {
    const { agenda, customer, employee } = sequelize.models;

    customer.hasMany(agenda);
    agenda.belongsTo(customer);

    employee.hasMany(agenda);
    agenda.belongsTo(employee);
}

module.exports = { applyRelations };