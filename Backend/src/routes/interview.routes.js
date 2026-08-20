const express = require("express")

const authmiddleware = require("../middlewares/auth.middleware")

const interviewController = require("../controllers/interview.controller")

const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

interviewRouter.post(
    "/",
    authmiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterViewReportController
)

module.exports = interviewRouter