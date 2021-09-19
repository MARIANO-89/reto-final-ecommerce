const { Sequelize, DataTypes } = require('sequelize');
const Profiles = require('./profiles');
const sequelize = require('../bd_connection');

const Users = sequelize.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile: {
            type: DataTypes.INTEGER,
            references: { model: Profiles, key: 'id' },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Users;
