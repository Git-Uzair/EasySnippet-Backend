'use strict'

const jwt = require('jsonwebtoken')

 class AuthMiddleware {

    static generateAccessToken(_id) {
        return jwt.sign({ _id }, "$NIPP3T$3cr3t", { expiresIn: '1 day' });
    }

    static decodeToken(token) {
        return jwt.decode(token)._id;
    }
 }

 module.exports = { AuthMiddleware }