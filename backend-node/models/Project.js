const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Portfolio = require('./Portfolio');

let Project = null;

if (sequelize) {
    Project = sequelize.define('Project', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    technologies: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    github: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    image: {
        type: DataTypes.TEXT, // Store base64 encoded image data
        allowNull: true
    },
    portfolioId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Portfolio,
            key: 'id'
        }
    }
}, {
    tableName: 'projects',
    timestamps: false
});

// Define associations
Portfolio.hasMany(Project, {
    foreignKey: 'portfolioId',
    as: 'projects',
    onDelete: 'CASCADE'
});

if (Portfolio && Project) {
    Project.belongsTo(Portfolio, {
        foreignKey: 'portfolioId',
        as: 'portfolio'
    });
}
}

module.exports = Project;
