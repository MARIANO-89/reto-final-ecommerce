const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'ecommerce.db',
});

module.exports = sequelize;
