const express = require("express")
const authController = require("../controllers/auth.controller.js")

const authRouter = express.Router();

/**
 * @rout POST /api/auth/register
 */

authRouter.post("/register",authController.registerUserController)

module.exports = authRouter