import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Platform } from '../models/platform.model.js';
import { Social } from '../models/social.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createSocialPlatform = asyncHandler( async (req, res) => {
    const { passkey, name, icon } = req.body ;

    if(passkey === process.env.CRM_API_PASSKEY){
        await Platform.create({
           name,
           icon
        });

        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Social Platform created Successfully!")
        );
    }
    
    return res
        .status(400)
        .json(
            new ApiError(400,"Incorrect Credentials")
        );
});

const getSocialPlatforms = asyncHandler( async (req, res) => {
    const platforms = await Platform.find();

    return res
    .status(200)
    .json(
        new ApiResponse(200,{platforms},"Platforms Fetched Successfully!")
    )

});

export {
    createSocialPlatform,
    getSocialPlatforms
}