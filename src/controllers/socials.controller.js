import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Platform } from '../models/platform.model.js';
import { Social } from '../models/social.model.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

const createNewSocialForUser = asyncHandler( async (req, res) => {
    const { platformId, link, order } = req.body ;

    const newSocial = await Social.create({
        platform : platformId,
        link,
        order,
        user : req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200,{},"Your Social has been created!")
    )
});

const getUserRelatedPlatforms = asyncHandler( async (req, res) => {
    const allSocials = await Social.aggregate([
        {
            $match : {
                user : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "platforms",
                localField: "platform",
                foreignField: "_id",
                as: "platform",
            }
        },
        {
            $project : {
                _id : 1,
                link : 1,
                platform : 1,
                order : 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200,{ userPlatforms : allSocials},"Social Platforms fetched Successfully !")
    )
});

// update specific platform
const updateSocialPlatform = asyncHandler( async (req, res) => {
    const { socialId , link } = req.body ;
    const social = await Social.findByIdAndUpdate(
        socialId,
        {
            $set : {
                link : link
            }
        },
        {
            new  : true
        }
    ).select(
        "-user"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200,social,"Social Updated Successfully!")
        )
});

// delete specofic platform
// save the ordering of the platform list 

export {
    createSocialPlatform,
    getSocialPlatforms,
    createNewSocialForUser,
    getUserRelatedPlatforms,
    updateSocialPlatform
}