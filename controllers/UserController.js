
const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')
const { AuthController } = require('./AuthController')
const { User } = require('../schema/user')
const { OTP } = require('../utils/OTP')
const { PromiseEjs } = require('../utils/promiseEjs')
const nodemailer = require('../utils/nodeMailer')
const mongoose = require('mongoose')

class UserController {


    static async addUser(req, res) {
        try {
            let email = req.body.email
            let checkUser = await User.findOne({ email: email })

            if (checkUser) {
                //generate otp and email
                //send email for otp
                let otp = OTP.totp({
                    secret: checkUser.secret,
                    encoding: "base32"
                })
                let emailBody = {
                    otp: otp,
                    title: "OTP Notification",
                    body: "Here is your OTP: ",
                    email: email
                }
                //smtp is not working as of yet
                console.log(emailBody)
                // const html = await PromiseEjs.renderFile('./email_template/otp.ejs', emailBody)
                // await nodemailer.sendMail({
                //     to: email,
                //     subject: 'Easy Snippet OTP',
                //     html: html,
                //     from: 'noreply@easysnippet.com  '
                // })
                //end of email section
                return new Response(res, { _id: checkUser._id }, "OTP sent to email")
            } else {
                //generate OTP
                //save OTP in user
                //send user email about otp

                let secret = OTP.generateSecret({ length: 20 }).base32;

                let user = new User({
                    email: email,
                    secret: secret
                })
                await user.save()

                //email the OTP to the user
                let otp = OTP.totp({
                    secret: secret,
                    encoding: "base32"
                })
                let emailBody = {
                    otp: otp,
                    title: "OTP Notification",
                    body: "Here is your OTP: ",
                    email: email
                }
                //smtp is not working as of yet
                console.log(emailBody)
                // const html = await PromiseEjs.renderFile('./email_template/otp.ejs', emailBody)
                // await nodemailer.sendMail({
                //     to: email,
                //     subject: 'Easy Snippet OTP',
                //     html: html,
                //     from: 'noreply@easysnippet.com'
                // })
                //end of email section

                return new Response(res, {
                    _id: user._id
                }, "User created")

            }
        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async getAllUsers(req, res) {
        try {
            let users = await User.find()
            if (users) {
                return new Response(res, { users: users }, "Users list")
            }
            else {
                return new Response(res, {}, "No users found", false, 404)

            }
        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async getUser(req, res) {
        try {
            let _id = mongoose.Types.ObjectId(req.params.id)
            let user = await User.findOne({ _id: _id })
            if (user) {
                return new Response(res, { user: user }, "User Found")
            }
            else {
                return new Response(res, null, "User not found", false, 404)
            }
        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async deleteUser(req, res) {
        try {
            let _id = mongoose.Types.ObjectId(req.params.id)
            let user = await User.findOne({ _id: _id })
            if (user) {
                let deleted = await User.deleteOne({ _id: _id })
                //delete all user snippets associated and history
                await Snippet.deleteMany({ userId: user._id })
                await SnippetHistory.deleteMany({ userId: user._id })
                
                return new Response(res, { _id: _id }, "User deleted")
            }
            else {
                return new Response(res, null, "No user found", false, 404)

            }

        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async updateUser(req, res) {
        try {

            let _id = mongoose.Types.ObjectId(req.params.id)
            let email = req.body.email

            let user = await User.findOneAndUpdate({ _id: _id }, { email: email }, { new: true })
            if (user) {
                return new Response(res, { user: user }, "User updated succesfully")

            }
            else {
                return new Response(res, null, "No user found", false, 404)
            }

        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

}

module.exports = { UserController }