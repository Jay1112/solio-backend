import express from 'express';
import { registerUser, userVerification, regenerateOTP, loginUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/verify-otp").post(userVerification);
authRouter.route("/regenerate-otp").post(regenerateOTP);
authRouter.route("/login").post(loginUser);

export default authRouter;