const { DataTypes } = require('sequelize');
const sequelize = require('../bd_connection');
const Users = require('./users');

const SellDetails = sequelize.define(
    'sellDetails',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        client: {
            type: DataTypes.INTEGER,
            references: { model: Users, key: 'id' },
            allowNull: false,
        },

        discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        created: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = SellDetails;
