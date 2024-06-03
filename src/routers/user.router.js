import express from 'express';
import { 
    getUserDetails
} from '../controllers/user.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

// secure routes
userRouter.route("/details").get(verifySession,getUserDetails);

export default userRouter;