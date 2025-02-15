require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const database = require('./db/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const initDatabase = require("./db/initDatabase");
const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())
app.use('/api', router);
app.use(errorMiddleware)

const start = async () => {
    await initDatabase()
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

start()
