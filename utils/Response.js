'use strict'

class Response {
    constructor (res, data, message = '', success = true, responseCode = 200) {
        this.success = success
        this.data = data
        this.message = message
        this.responseCode = responseCode
        this.res = res
        this.send()
    }

    /**
     * Send resposne
     */
    send () {
        this.res.status(this.responseCode).send(
            {
                data: this.data,
                message: this.message,
                success: this.success,
                status: this.responseCode
            }
        )
    }
}

module.exports = { Response }
