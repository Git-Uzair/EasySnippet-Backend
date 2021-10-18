'use strict'

const { Response } = require('./Response')

class ErrorHandler {
    static sendError (res, error) {
        try {
            console.log(error)
            if (error.code <= 500 && error.code >= 300) {
                return new Response(res, error, JSON.stringify(error), false, error.code)
            } else {
                return new Response(res, error, JSON.stringify(error), false, 400)
            }
        } catch (error) {
            return new Response(res, { success: false }, 'Something went wrong', false, 500)
        }
    }
}

module.exports = { ErrorHandler }
