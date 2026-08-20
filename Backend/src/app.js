const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

/**
 * require a;; the routes here
 */
const authRouter = require("./routes/auth.routes.js")
const interviewRouter = require("./routes/interview.routes.js")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app