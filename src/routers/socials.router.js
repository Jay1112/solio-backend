import express from 'express';
import { 
    createSocialPlatform,
    getSocialPlatforms
} from '../controllers/socials.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const socialsRouter = express.Router();

// secure routes
socialsRouter.route("/create-platform").post(createSocialPlatform);
socialsRouter.route("/platforms").get(verifySession,getSocialPlatforms);

export default socialsRouter;