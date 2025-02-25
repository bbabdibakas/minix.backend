require('dotenv').config();
const { Sequelize } = require('sequelize');

class Database {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'postgres',
                logging: false,
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            }
        );
    }

    async checkConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection established.');
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    async syncModels() {
        try {
            await this.sequelize.sync({ alter: true }); // Создаёт/обновляет таблицы
            console.log('Database models synchronized.');
        } catch (error) {
            console.error('Database models synchronization error:', error);
        }
    }
}

module.exports = new Database();