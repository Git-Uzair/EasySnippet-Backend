'use strict'

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const mongoose = require('./schema/mongoose')

const api = require('./routes/api')
const app = express();

app.use(bodyParser.json({ limit: '150mb' }))
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true,
    parameterLimit: 50000
}))
app.use(express.static(path.join(__dirname, 'public')));

var whitelist = [
    "http://localhost:3000",
    "http://localhost:4200",
    "http://127.0.0.1:8000",
]

var corsOptionsDelegate = function (req, callback) {
    var corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true }
    } else {
        corsOptions = { origin: false, credentials: true }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use('/api', api)

app.listen(3000, () => {
    mongoose.connect()
    console.log('Listening on port 3000')
})
