const { RRule } = require('rrule');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('event', {
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
        all_day: {
            type: DataTypes.BOOLEAN
        },
        type: {
            type: DataTypes.ENUM("j", "v", "p", "s", "m"),
            defaultValue: "j",
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
        },
        //recurring events
        recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            default: false
        },
        interval: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        frequency: {
            type: DataTypes.INTEGER, //3: daily, 2: weekly, 1: monthly, 0: yearly
            allowNull: true,
        },
        byweekday: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
        },
        until: {
            type: DataTypes.INTEGER, //0: never, 1: date, 2: occurrences
            allowNull: true,
        },
        until_date: {
            type: DataTypes.DATEONLY, //0: never, 1: date, 2: occurrences
            allowNull: true,
        },
        until_occurrences: {
            type: DataTypes.INTEGER, //0: never, 1: date, 2: occurrences
            allowNull: true,
        },
        rrule: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ex_dates: {
            type: DataTypes.ARRAY(DataTypes.DATE), //0: never, 1: date, 2: occurrences
            allowNull: true,
        },
        //handle custom events on recurring series
        parent_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'event',
                key: 'id'
            }
        },
    }, {
        hooks: {
            beforeCreate: async(event, options, cb) => {
                return new Promise((resolve, reject) => {
                    let start = new Date(event.start_date),
                        end = new Date(event.end_date),
                        hrs = (Math.abs(end - start) / 3.6e6).toFixed(2);
                    
                    event.hours = hrs;

                    return resolve(event, options);
                });
            },
            beforeUpdate: async(event, options) => {
                return new Promise((resolve, reject) => {
                    let start = new Date(event.start_date),
                        end = new Date(event.end_date),
                        hrs = (Math.abs(end - start) / 3.6e6).toFixed(2);
                    
                    event.hours = hrs;

                    return resolve(event, options);
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
        tableName: 'event'
    });
};