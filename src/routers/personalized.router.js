import express from 'express';
import { 
    getUserPersonalizedItems,
    createUserPersonalized,
    updateUserPersonalized,
    deleteUserPersonalized,
    getAllPersonalizationTypes
} from '../controllers/personalized.controller.js';
import { verifySession } from '../middlewares/auth.middleware.js';

const personalizedRouter = express.Router();

// secure routes
personalizedRouter.route("/all").get(verifySession,getUserPersonalizedItems);
personalizedRouter.route("/create").post(verifySession,createUserPersonalized);
personalizedRouter.route("/update/:id").post(verifySession,updateUserPersonalized);
personalizedRouter.route("/delete/:id").post(verifySession,deleteUserPersonalized);
personalizedRouter.route("/types").get(verifySession,getAllPersonalizationTypes);

export default personalizedRouter;