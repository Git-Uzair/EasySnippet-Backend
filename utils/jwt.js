const jwt = require("jsonwebtoken");

class JWT {
    static authenticateToken(req, res, next) {
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

    static generateAccessToken(_id) {
        // expires after half and hour (1800 seconds = 30 minutes)
        return jwt.sign({ _id }, "$NIPP3T$3cr3t", { expiresIn: '1 day' });
    }

    static decodeToken(token) {
        return jwt.decode(token)._id;
    }
}

module.exports = { JWT }

