import express from 'express';
import { 
    getUserPersonalizedItems,
    createUserPersonalized,
    updateUserPersonalized,
    deleteUserPersonalized
} from '../controllers/personalized.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const personalizedRouter = express.Router();

// secure routes
personalizedRouter.route("/all").get(verifySession,getUserPersonalizedItems);
personalizedRouter.route("/create").post(verifySession,createUserPersonalized);
personalizedRouter.route("/update").post(verifySession,updateUserPersonalized);
personalizedRouter.route("/delete").post(verifySession,deleteUserPersonalized);

export default personalizedRouter;