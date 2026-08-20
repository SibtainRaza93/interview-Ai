const jwt = require("jsonwebtoken")
const tokenBlacklist = require("../models/blacklist.models")
const tokenBlacklistModel = require("../models/blacklist.models")

async function authUser(req, res, next) {
    // console.log("cookies:", req.cookies)
    // console.log("authorization:", req.headers.authorization)
    // console.log("jwt secret exists:", !!process.env.JWT_SECRET)
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Token is not provided."
        })
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is blocklisted: Please login again."
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
    //     console.log("jwt error name:", error.name)
    // console.log("jwt error message:", error.message)
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = { authUser }