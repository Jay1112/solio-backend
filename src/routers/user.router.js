import express from 'express';
import { 
    getUserDetails,
    updateDashBoardDetails
} from '../controllers/user.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

// secure routes
userRouter.route("/details").get(verifySession,getUserDetails);
userRouter.route("/personal-info").post(verifySession,updateDashBoardDetails);

export default userRouter;