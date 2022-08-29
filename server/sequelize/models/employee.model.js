const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('employee', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        surname: {
            allowNull: false,
            type: DataTypes.STRING
        },
        fullname: {
            allowNull: true,
            type: DataTypes.STRING
        },
        number: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phone: {
            allowNull: true,
            type: DataTypes.STRING
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING
        },
        active: {
            allowNull: true,
            type: DataTypes.BOOLEAN
        }
    }, {
        hooks: {
            beforeCreate: async(employee, options, cb) => {
                return new Promise((resolve, reject) => {
                    employee.fullname = employee.name + " " + employee.surname;

                    return resolve(employee, options);
                });
            },
            beforeUpdate: async(employee) => {
                return new Promise((resolve, reject) => {
                    employee.fullname = employee.name + " " + employee.surname;
                    
                    return resolve(employee, options);
                });
            },
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
        tableName: 'employee'
    });
};