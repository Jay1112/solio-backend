import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Personalized } from '../models/personalized.model.js';
import { personalizedObj } from '../utils/Personalized.js';
import mongoose from 'mongoose';

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
    const personalizedId = req.params['id'];
    const { type , personalizedData } = req.body ;

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
        personalizedId,
        {
            $set : {
                type,
                customData : personalizedData
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
    const personalizedId = req.params['id'];

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

const getAllPersonalizationTypes = asyncHandler( async ( req, res) => {
    const types = personalizedObj.getAllTypes();
    return res
        .status(200)
        .json(
            new ApiResponse(200,types,"Types have been fetched Succssfully")
        )
});

export {
    getUserPersonalizedItems,
    createUserPersonalized,
    updateUserPersonalized,
    deleteUserPersonalized,
    getAllPersonalizationTypes
};