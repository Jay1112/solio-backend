import express from 'express';
import { 
    getUserPersonalizedItems,
    createUserPersonalized
} from '../controllers/personalized.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const personalizedRouter = express.Router();

// secure routes
personalizedRouter.route("/all").get(verifySession,getUserPersonalizedItems);
personalizedRouter.route("/create").post(verifySession,createUserPersonalized);

export default personalizedRouter;