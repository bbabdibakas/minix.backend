const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const database = require('./db/index')

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use('/api', router);

const start = async () => {
    await database.connect()

    const createTableSQL = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`;

    try {
        await database.runQuery(createTableSQL);
        console.log('Table "users" checked/created successfully.');
    } catch (err) {
        console.error('Error creating the table:', err);
    }

    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

start()
