'use strict'

// const { Admin } = require('./../schema/admin')
// const { Response } = require('./../utils/Response')
const { jwt } = require('jsonwebtoken')

class AdminMiddleware {

    static isAuthorized(req, res, next) {
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token

        jwt.verify(token, "$NIPP3T$3cr3t", (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next() // pass the execution off to whatever request the client intended
        })
    }
    // static async isAuthorized(req, res, next) {
    //     try {
    //         const token = req.query.token
    //         let checkToken = await Admin.findOne({ authToken: token })
    //         if(checkToken) {
    //             next()
    //         } else {
    //             return new Response(res, {success: false}, 'Invalid Token Request', false, 401)
    //         }
    //     } catch (error) {
    //         return false
    //     }
    // }
}

module.exports = { AdminMiddleware }