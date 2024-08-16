import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Personalized } from '../models/personalized.model.js';
import { personalizedObj } from '../utils/Personalized.js';

const getUserPersonalizedItems = asyncHandler( async ( req, res) => {
    const personalizes = await Personalized.aggregate([
        {
            $match : {
                user : new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(200,personalizes,"User Personalizes Fetched Successfully!!")
    )
});

const createUserPersonalized = asyncHandler( async ( req, res) => {
    const { type, personalizedData } = req.body ;

    // check all required fields are present or not
    const isAnyEmptyField = [type, personalizedData].some((field) => {
        return !field;
    });
    if(isAnyEmptyField){
        return res
        .status(400)
        .json(
            new ApiError(400,"All Fields are required!")
        )
    }

    const isValidFormat = personalizedObj.isValidObject(type, personalizedData);

    if(!isValidFormat){
        return res
            .status(400)
            .json(
                new ApiError(400,"Invalid Body Data Format!")
            )
    }

    const newPersonlizedObj = await Personalized.create({
        type,
        customData : personalizedData
    });

    if(!newPersonlizedObj){
        return res.status(400).json(
            new ApiResponse(400,{}, "Error Occurring while creating personalized item")
        );
    }

    return res.status(200).json(
        new ApiResponse(200,{}, "Personalized Item Created Successfully!")
    );
});

export {
    getUserPersonalizedItems,
    createUserPersonalized
};