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
        customData : personalizedData,
        user : req.user?._id
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

const updateUserPersonalized = asyncHandler( async ( req, res) => {
    const { personalizedId ,type, personalizedData } = req.body ;

    // check all required fields are present or not
    const isAnyEmptyField = [personalizedId, type, personalizedData].some((field) => {
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

    const updatedPersonalized = await Personalized.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                type,
                customData
            }
        },
        {
            new  : true
        }
    );

    if(!updatedPersonalized){
        return res.status(400).json(
            new ApiResponse(400,{}, "Error Occurring while modifying personalized item")
        );
    }

    return res.status(200).json(
        new ApiResponse(200,{}, "Personalized Item Modified Successfully!")
    );
});

const deleteUserPersonalized = asyncHandler( async ( req, res) => {
    const { personalizedId } = req.body ;

    // check all required fields are present or not
    const isAnyEmptyField = [personalizedId].some((field) => {
        return !field;
    });
    if(isAnyEmptyField){
        return res
        .status(400)
        .json(
            new ApiError(400,"All Fields are required!")
        )
    }

    const deletedPersonalized = await Personalized.deleteOne({ _id : personalizedId });

    if(!deletedPersonalized){
        return res.status(400).json(
            new ApiResponse(400,{}, "Error Occurring while creating personalized item")
        );
    }

    return res.status(200).json(
        new ApiResponse(200,{}, "Personalized Item Removed Successfully!")
    );
});

export {
    getUserPersonalizedItems,
    createUserPersonalized,
    updateUserPersonalized,
    deleteUserPersonalized
};