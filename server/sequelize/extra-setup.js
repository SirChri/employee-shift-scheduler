function applyRelations(sequelize) {
    const { event, customer, employee } = sequelize.models;

    customer.hasMany(event);
    event.belongsTo(customer);

    employee.hasMany(event);
    event.belongsTo(employee);
}

module.exports = { applyRelations };