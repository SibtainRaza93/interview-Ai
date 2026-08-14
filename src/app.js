const express = require("express")

const app = express()

app.use(express.json())

/**
 * require a;; the routes here
 */
const authRouter = require("./routes/auth.routes.js")

app.use("/api/auth", authRouter)


module.exports = app