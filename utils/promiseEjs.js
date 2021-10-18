const ejs = require('ejs')

class PromiseEjs {
    /**
     * @description Returns HTML from provided EJS template.
     * @param {string} filepath
     * @param {json} data
     */
    static async renderFile (filepath, data) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(filepath, data, (err, str) => {
                if (err) { reject(err) } else resolve(str)
            })
        })
    }
}

module.exports = { PromiseEjs }
