const jwt = require('jsonwebtoken');
const JWT_SIGN = "Hey@you@got@my@signature"
//just a try----
// const jwtSignKey = process.env.JWT_SIGN;
// require('dotenv').config();

const getuser = (req, res, next) => {
    //Fetch user id from authentication token
    const token = req.header("auth-token")
    if (!token) {
        res.send("No token present")
    }
    try {
        const data = jwt.verify(token, JWT_SIGN)
        req.user = data.user
        next();

    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
}

module.exports = getuser