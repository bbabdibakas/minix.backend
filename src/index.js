const express = require('express')
const cors = require('cors')

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

app.post('/api/register', (req, res) => {
    const {name, email, username, password} = req.body

    if (!name || !email || !username || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        })
    }

    try {
        res.status(200).json({
            message: 'Successfully registered',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error',
        });
    }
})

const start = () => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

start()
