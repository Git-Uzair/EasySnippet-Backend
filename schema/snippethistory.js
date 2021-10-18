'use strict'

const { mongoose } = require('./mongoose')

let snippethistorySchema = new mongoose.Schema(
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
        snippetId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'snippets'
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


let SnippetHistory = mongoose.model('Snippethistory', snippethistorySchema)
module.exports = { SnippetHistory }
