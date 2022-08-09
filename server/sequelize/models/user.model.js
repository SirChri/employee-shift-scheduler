const crypto = require("crypto");
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    var userSchema = sequelize.define(
        "user", {
            id: {
                field: "id",
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            password: {
                field: "password",
                type: DataTypes.TEXT,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                field: "email",
                allowNull: false,
            },
            salt: {
                type: DataTypes.TEXT,
                field: "salt",
                allowNull: true,
            },
        }, {
            hooks: {
                beforeCreate: async(user, options, cb) => {
                    return new Promise((resolve, reject) => {
                        if (user.password) {
                            user.salt = crypto.randomBytes(16).toString('hex');

                            crypto.pbkdf2(user.password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                                if (err)
                                    return reject(err);

                                user.password = hashedPassword.toString('hex');

                                return resolve(user, options);
                            });
                        }
                    });
                },
                beforeUpdate: async(user) => {
                    return new Promise((resolve, reject) => {
                        if (user.password) {
                            user.salt = crypto.randomBytes(16).toString('hex');

                            crypto.pbkdf2(user.password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                                if (err)
                                    return reject(err);

                                user.password = hashedPassword.toString('hex');

                                return resolve(user, options);
                            });
                        }
                    });
                },
            },
            // define the table's name
            tableName: 'user',

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true
        }
    );
    userSchema.prototype.validPassword = async(password, hash) => {
        return crypto.timingSafeEqual(password, hash)
    };
}