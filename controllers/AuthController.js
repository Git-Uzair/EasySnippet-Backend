'use strict'

const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')
const { User } = require('../schema/user')
const { OTP } = require('../utils/OTP')
const mongoose = require('mongoose')
const { AuthMiddleware } = require('./../middlewares/AuthMiddleware')


class AuthController {

    static async verifyOTP(req, res) {
        try {
            let otp = parseInt(req.body.otp, 10)
            let userId = mongoose.Types.ObjectId(req.body._id)
            let checkUser = await User.findOne({ _id: userId })

            if (checkUser) {
                //validate otp
                //send jwt token back 
                let valid = OTP.totp.verify({
                    secret: checkUser.secret,
                    encoding: 'base32',
                    token: otp,
                    window: 2
                })
                if (valid) {
                    //send jwt token back
                    let token = AuthMiddleware.generateAccessToken(checkUser._id)
                    await User.findByIdAndUpdate({_id: checkUser._id}, {
                        $set: {
                            authToken: token
                        }
                    })
                    return new Response(res, { valid: true, token: token, _id: checkUser._id }, "OTP verified")
                }
                else {
                    //return response of invalid OTP
                    return new Response(res, { valid: false }, "OTP invalid or expired", false, 401)
                }


            } else {
                //usernotfound
                return new Response(res, null, "User not found", false, 404)


            }
        }
        catch (error) {
            return ErrorHandler.sendError(res, error)
        }
    }

    static async login(req, res) {
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

    static async loginAdmin(req, res) {
        try {
            console.log('loginAdmin api called...')
            return new Response(res, { }, 'API Called', true, 200)
        } catch (error) {
            ErrorHandler.sendError(res,error)
        }
    }

    static async checkAuth(req, res) {
        try {
            const token = req.query.token
            let checkToken = await User.findOne({_id: AuthMiddleware.decodeToken(token)})
            if(checkToken) {
                return new Response(res, { Auth: true }, 'Authenticated', true, 200)    
            } else {
                return new Response(res, { Auth: false }, 'Authenticated', true, 200)    
            }
        } catch (error) {
            ErrorHandler.sendError(res,error)
        }
    }
}

module.exports = { AuthController }