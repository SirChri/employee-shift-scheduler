function applyRelations(sequelize) {
    const { agenda, cliente, dipendente } = sequelize.models;

    cliente.hasMany(agenda);
    agenda.belongsTo(cliente);

    dipendente.hasMany(agenda);
    agenda.belongsTo(dipendente);
}

module.exports = { applyRelations };