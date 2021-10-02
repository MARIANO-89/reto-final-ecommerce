const { DataTypes } = require('sequelize');
const sequelize = require('../bd_connection');
const Users = require('./users');

const Products = sequelize.define(
    'products',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        owner: {
            type: DataTypes.INTEGER,
            references: { model: Users, key: 'id' },
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

module.exports = Products;
