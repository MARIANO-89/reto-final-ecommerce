const { DataTypes } = require('sequelize');
const sequelize = require('../bd_connection');

const Profiles = sequelize.define(
    'profiles',
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
    },
    {
        timestamps: false,
    }
);

module.exports = Profiles;
