const { DataTypes } = require('sequelize');
const sequelize = require('./database');

let Portfolio = null;

if (sequelize) {
    Portfolio = sequelize.define('Portfolio', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    profilePhoto: {
        type: DataTypes.TEXT, // Store base64 encoded image data
        allowNull: true
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'modern',
        validate: {
            isIn: [['modern', 'creative', 'professional', 'minimal']]
        }
    }
}, {
    tableName: 'portfolios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
}

module.exports = Portfolio;
