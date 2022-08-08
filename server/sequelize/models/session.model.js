const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    var sessionSchema = sequelize.define(
        "session",
        {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            expires: DataTypes.DATE,
            data: DataTypes.STRING(50000),
        },
        {
            indexes: [
                {
                    name: 'session_sid_index',
                    method: 'BTREE',
                    fields: ['sid'],
                },
            ],
            // define the table's name
            tableName: 'session',

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