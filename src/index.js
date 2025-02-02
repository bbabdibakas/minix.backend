require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const database = require('./db/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())
app.use('/api', router);
app.use(errorMiddleware)

const start = async () => {
    await database.connect()

    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`;

    const createTokensTable = `CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        refreshToken TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`;

    try {
        await database.runQuery(createUsersTable);
        console.log('Table "users" checked/created successfully.');
        await database.runQuery(createTokensTable);
        console.log('Table "tokens" checked/created successfully.');
    } catch (error) {
        console.error('Error creating the table:', error);
    }

    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

start()
