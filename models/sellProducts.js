const { DataTypes } = require('sequelize');
const sequelize = require('../bd_connection');
const Products = require('./products');
const SellDetails = require('./sellDetails');

const SellProducts = sequelize.define(
    'sellProducts',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product: {
            type: DataTypes.INTEGER,
            references: { model: Products, key: 'id' },
            allowNull: false,
        },
        sellDetails: {
            type: DataTypes.INTEGER,
            references: { model: SellDetails, key: 'id' },
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = SellProducts;
