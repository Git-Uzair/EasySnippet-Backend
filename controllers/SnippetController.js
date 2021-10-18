
const { Response } = require('../utils/Response')
const { ErrorHandler } = require('../utils/ErrorHandler')
const { AuthController } = require('./AuthController')
const { Snippet } = require('../schema/snippet')
const { SnippetHistory } = require('../schema/snippethistory')

const { OTP } = require('../utils/OTP')
const { PromiseEjs } = require('../utils/promiseEjs')
const nodemailer = require('../utils/nodeMailer')
const mongoose = require('mongoose')
const e = require('express')

class SnippetController {

    static async addSnippet(req, res) {
        try {
            let userId = mongoose.Types.ObjectId(req.body._id)
            let text = req.body.text
            let title = req.body.title
            let imgURL = req.body.imgURL
            let snippet = new Snippet({
                title: title,
                userId: userId,
                text: text,
                imgURL: imgURL
            })

            await snippet.save()
            return new Response(res, {}, "Snippet added successfully")
        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async getAllSnippets(req, res) {
        try {
            let snippets = await Snippet.find()
            if (snippets) {
                return new Response(res, { snippets: snippets }, "Snippets found")
            }
            else {
                return new Response(res, [], "No snippets found", false, 404)
            }
        } catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async getSnippet(req, res) {
        try {

            let snippetId = mongoose.Types.ObjectId(req.params.id)
            let snippet = await Snippet.findOne({ _id: snippetId })

            if (snippet) {
                return new Response(res, { snippet: snippet }, "Snippet found")
            }
            else {
                return new Response(res, null, "Snippet not found", false, 404)
            }
        } catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async updateSnippet(req, res) {
        try {
            let snippetId = mongoose.Types.ObjectId(req.params.id)
            let text = req.body.text
            let title = req.body.title
            let imgURL = req.body.imgURL
            let snippet = await Snippet.findOneAndUpdate({ _id: snippetId }, { text: text, imgURL: imgURL, title: title }, { new: false })
            if (snippet) {
                //add into snippet history too
                let old_snippet = new SnippetHistory({
                    title: snippet.title,
                    text: snippet.text,
                    imgURL: snippet.imgURL,
                    userId: mongoose.Types.ObjectId(snippet.userId),
                    snippetId: snippetId
                })

                await old_snippet.save()

                return new Response(res, "", "Snippet updated successfully")
            }
            else {
                return new Response(res, null, "Snippet not found", false, 404)
            }
        } catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async deleteSnippet(req, res) {
        try {
            let snippetId = mongoose.Types.ObjectId(req.params.id)
            let snippet = await Snippet.findOneAndDelete({ _id: snippetId })
            if (snippet) {

                //delete corresponding snippet histories too
                await SnippetHistory.deleteMany({ snippetId: snippetId })
                return new Response(res, { snippet: snippet }, "Snippet deleted successfully")
            }
            else {
                return new Response(res, null, "Snippet not found", false, 404)
            }
        } catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

}

module.exports = { SnippetController }