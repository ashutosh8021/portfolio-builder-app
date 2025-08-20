const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = null;

// Only create Sequelize instance if DB_HOST is provided
if (process.env.DB_HOST && process.env.DB_HOST.trim() !== '') {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'portfolio_builder',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || 'password',
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

module.exports = sequelize;
