const jwt = require("jsonwebtoken");

const authenticate = (req, res, endpoint) => {

    let access_token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        access_token = req.headers.authorization.split(" ")[1];

        return jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (err, result) => {
            if (err) return res.status(401).json({ message: 'You are not authorized!' });

            req.user = result;
            return endpoint(req, res);
        })
        
    } else {
        return res.status(401).json({ message: 'You are not authorized!' });
    }
}

module.exports = { authenticate };
