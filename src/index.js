require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const database = require('./db/database')
const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())
app.use('/api', router);
app.use(errorMiddleware)

const start = async () => {
    try {
        // await initDatabase() moving to postgresql
        await database.checkConnection()
        await database.syncModels()
        // app.listen(port, () => {
        //     console.log(`Server running on port: ${port}`)
        // })
    } catch (error) {
        console.log('Error starting server:', error)
        process.exit(1)
    }
}

void start()
