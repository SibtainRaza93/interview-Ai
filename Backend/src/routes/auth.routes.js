const express = require("express")
const authController = require("../controllers/auth.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")

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

//logout 
authRouter.get("/logout", authController.logoutUserController)

// get infromation of user from database

authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter