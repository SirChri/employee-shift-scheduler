function applyRelations(sequelize) {
    const { event, customer, employee, calendar } = sequelize.models;

    customer.hasMany(event);
    event.belongsTo(customer);

    employee.hasMany(event);
    event.belongsTo(employee);

    employee.hasMany(calendar);
    calendar.belongsTo(employee);
}

module.exports = { applyRelations };