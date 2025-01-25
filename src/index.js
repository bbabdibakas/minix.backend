const express = require('express')
const cors = require('cors')
const router = require('./router/index')

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use('/api', router);

const start = () => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

start()
