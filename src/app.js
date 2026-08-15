const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

/**
 * require a;; the routes here
 */
const authRouter = require("./routes/auth.routes.js")

app.use("/api/auth", authRouter)


module.exports = app