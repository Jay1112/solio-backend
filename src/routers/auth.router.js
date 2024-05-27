import express from 'express';
import { registerUser, userVerification } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/verify-otp").post(userVerification);

export default authRouter;