'use strict'

const { mongoose } = require('./mongoose')

let snippetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'snippets'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        imgURL: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)


let Snippet = mongoose.model('Snippet', snippetSchema)
module.exports = { Snippet }
