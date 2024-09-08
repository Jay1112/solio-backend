import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

// get user details
const getUserDetails = asyncHandler( async ( req, res) => {
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken -otp -otpExpiry"
    );

    if(!user){
        throw new ApiError(404,"User does not found!!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"User details fetched successfully!!")
    )
});

const updateDashBoardDetails = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken -otp -otpExpiry"
    );

    if(!user){
        return res
            .status(404)
            .json(
                new ApiError(404,"User does not found!")
            );
    }

    const { fullname, location, description } = req.body ;

    const isAnyEmptyFieldMissing = [fullname, location, description].some((field) => {
        if(!field){
            return true;
        }
        return false;
    });
    if(isAnyEmptyFieldMissing){
        return res
        .status(400)
        .json(
            new ApiError(400,"Required Fields : fullname, location, description")
        );
    }

    user.fullname = fullname ;
    user.location = location ;
    user.description = description ;

    await user.save({ validateBeforeSave : false });

    return res
        .status(200)
        .json(
            new ApiResponse(200,user,"Details Successfully Updated!!")
        )
});

export {
    getUserDetails,
    updateDashBoardDetails
};