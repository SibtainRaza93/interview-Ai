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
interviewRouter.get("/report/:interviewId",
    authmiddleware.authUser,
    interviewController.getInterviewReportByIdController)

    // GET/api/interview/
interviewRouter.get("/",
    authmiddleware.authUser,
    interviewController.getAllInterviewReportsController)

interviewRouter.post("/resume/pdf/:interviewReportId", authmiddleware.authUser,interviewController.generateResumePdfController)
module.exports = interviewRouter