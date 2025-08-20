const sequelize = process.env.NODE_ENV === 'production' ? 
    require('./database-production') : 
    require('./database');
const Portfolio = require('./Portfolio');
const Project = require('./Project');

const models = {
    sequelize,
    Portfolio,
    Project
};

module.exports = models;
