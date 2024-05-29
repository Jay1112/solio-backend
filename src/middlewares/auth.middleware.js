import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifySession = asyncHandler( async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        throw new ApiError(401,"Unauthorized Request!");
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -otp -otpExpiry"
    );

    if(!user){
        throw new ApiError(400,"Invalid Access Token");
    }

    req.user = user ;

    next();
});