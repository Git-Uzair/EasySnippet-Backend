'use strict'

const { mongoose } = require('./mongoose')

let userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        secret: String
    },
    {
        timestamps: true
    }
)

userSchema.index({ email: 1 }, { unique: true })

let User = mongoose.model('User', userSchema)
module.exports = { User }
