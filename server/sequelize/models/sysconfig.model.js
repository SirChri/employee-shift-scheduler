const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    var sysconfig = sequelize.define(
        "sysconfig", {
            id: {
                field: "id",
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            // define the table's name
            tableName: '_sysconfig',

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true
        }
    );
}
