import express from 'express';
import { 
    createSocialPlatform,
    getSocialPlatforms,
    createNewSocialForUser,
    getUserRelatedPlatforms,
    updateSocialPlatform
} from '../controllers/socials.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const socialsRouter = express.Router();

// secure routes
socialsRouter.route("/create-platform").post(createSocialPlatform);
socialsRouter.route("/platforms").get(verifySession,getSocialPlatforms);
socialsRouter.route("/create").post(verifySession,createNewSocialForUser);
socialsRouter.route("/user-platforms").get(verifySession,getUserRelatedPlatforms);
socialsRouter.route("/update-social").post(verifySession,updateSocialPlatform);

export default socialsRouter;