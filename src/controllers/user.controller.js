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

    res
    .status(200)
    .json(
        new ApiResponse(200,user,"User details fetched successfully!!")
    )
});

export {
    getUserDetails
};