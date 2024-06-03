import express from 'express';
import { 
    registerUser, 
    userVerification, 
    regenerateOTP, 
    loginUser, 
    logoutUser,
    getUserDetails 
} from '../controllers/auth.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/verify-otp").post(userVerification);
authRouter.route("/regenerate-otp").post(regenerateOTP);
authRouter.route("/login").post(loginUser);

// secure routes
authRouter.route("/logout").post(verifySession,logoutUser);
authRouter.route("/user-details").get(verifySession,getUserDetails);

export default authRouter;