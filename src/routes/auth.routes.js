const express = require("express")
const authController = require("../controllers/auth.controller.js")

const authRouter = express.Router();

/**
 * @rout POST /api/auth/register
 */

authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @access public
 */

authRouter.post("/login", authController.loginUserController)

module.exports = authRouter