const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('agenda', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT
        },
        start_date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        end_date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        customer_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'customer',
                key: 'id'
            }
        },
        employee_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'employee',
                key: 'id'
            }
        },
        hours: {
            type: DataTypes.DECIMAL
        }
    }, {
        hooks: {
            beforeCreate: async(agenda, options, cb) => {
                return new Promise((resolve, reject) => {
                    let start = new Date(agenda.start_date),
                        end = new Date(agenda.end_date),
                        hrs = (Math.abs(end - start) / 3.6e6).toFixed(2);
                    
                    agenda.hours = hrs;

                    return resolve(agenda, options);
                });
            },
            beforeUpdate: async(agenda, options) => {
                return new Promise((resolve, reject) => {
                    let start = new Date(agenda.start_date),
                        end = new Date(agenda.end_date),
                        hrs = (Math.abs(end - start) / 3.6e6).toFixed(2);
                    
                    agenda.hours = hrs;

                    return resolve(agenda, options);
                });
            }
        },
        
        // don't add the timestamp attributes (updatedAt, createdAt)
        //timestamps: false,

        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,

        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'agenda'
    });
};