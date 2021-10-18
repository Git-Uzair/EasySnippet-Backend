const mongoose = require('mongoose')
const tunnel = require('tunnel-ssh')


mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
var ssh = {}

const connect = () => {
        
        tunnel(ssh, function (error, server) {
            if (error) {
                console.log('SSH connection error: ' + error)
            }         
            mongoose.connect("connect URL goes here", { useNewUrlParser: true, useUnifiedTopology: true })
            var db = mongoose.connection
            db.on('error', console.error.bind(console, 'Database connection error:'))
            db.once('open', function () {
                console.log('Database connection successful.')
            })
        })    
}
module.exports = { mongoose, connect }
