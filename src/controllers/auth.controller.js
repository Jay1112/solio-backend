import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { generateOTP, getOTPExpiry } from '../utils/utilityFunctions.js';
import dotenv from 'dotenv';

dotenv.config();

const testServer = asyncHandler( async (req ,res) => {
    return res.status(200).json(
        new ApiResponse(200,{}, "server testing...")
    );
} )

// generate Refresh And Access Token
const generateAccessAndRefreshToken = async (userId) => {
   try {
     const user = await User.findById(userId);
     if(user){
        const accessToken  = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken ;

        await user.save({ validateBeforeSave : false });

        return {
            refreshToken,
            accessToken
        }
     }
   } catch (error) {
        console.log("Something went wrong while generating access and refresh token...",error);
   }
    return { 
        refreshToken : null,
        accessToken  :null
    };
}

// Register new User in Database
const registerUser = asyncHandler( async ( req, res) => {
    // extract details : username, email, password
    const { username, email, password } = req.body;

    // check all required fields are present or not
    const isAnyEmptyField = [username,email,password].some((field) => {
        const trimmed = field?.trim();
        return trimmed === '';
    });
    if(isAnyEmptyField){
        return res
        .status(400)
        .json(
            new ApiError(400,"All Fields are required!")
        )
    }

    // User already exists or not based on email and username
    const existedOne = await User.findOne({ $or : [ { username }, { email } ] });
    if(existedOne){
        return res
        .status(400)
        .json(
            new ApiError(400,"User already exists!")
        )
    }

    // generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // send OTP on email
    /* TO DO */

    // create user in db
    const user = await User.create({
        username : username?.toLowerCase(),
        email,
        password,
        otp,
        otpExpiry
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -otp -otpExpiry"
    );

    return res.status(200).json(
        new ApiResponse(200,createdUser, "User Registered Successfully!")
    );
});

// Request for New OTP
const regenerateOTP = asyncHandler( async ( req, res) => {
    const { email, username } = req.body ;

    if(!email && !username){
        return res
        .status(400)
        .json(
            new ApiError(400,"email or username is required to verify user.")
        )
    }

    const user = await User.findOne({ $or : [ { username }, { email } ] });
    if(!user){
        return res
        .status(400)
        .json(
            new ApiError(409,"User Not Found")
        )
    }

    // generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // send OTP on email
    /* TO DO */

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set : {
                otp : otp,
                otpExpiry : otpExpiry,
            }
        },
        {
            new  : true
        }
    ).select(
        "-password -refreshToken -otp -otpExpiry"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "New OTP Successfully Generated!!"
        )
    );
});

// Verify User using OTP
const userVerification = asyncHandler( async (req, res) => {
    const { email, username, otp } = req.body ;

    if(!email && !username){
        return res
        .status(400)
        .json(
            new ApiError(400,"email or username is required to verify user.")
        )
    }

    if(!otp){
        return res
        .status(400)
        .json(
            new ApiError(400,"OTP is required to verify user.")
        )
    }

    const user = await User.findOne({ $or : [ { username }, { email } ] });
    if(!user){
        return res
        .status(400)
        .json(
            new ApiError(409,"User not found")
        )
    }

    const currentTime = Date.now();
    const userOtp = `${user.otp}`;
    if(userOtp === otp && currentTime <= user.otpExpiry ){
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set : {
                    otp : null,
                    otpExpiry : null,
                    verified : true
                }
            },
            {
                new  : true
            }
        ).select(
            "-password -refreshToken -otp -otpExpiry"
        );
        
        return res.status(200).json(
            new ApiResponse(
                200,
                updatedUser,
                "OTP Successfully Verified"
            )
        );

    }else if(userOtp !== otp){
        return res.status(400).json(
            new ApiResponse(
                400,
                null,
                "Invalid OTP!"
            )
        );
    }else if(currentTime > user.otpExpiry){
        return res.status(400).json(
            new ApiResponse(
                400,
                null,
                "OTP is expired! Try to create new one"
            )
        );
    }else{
        return res.status(400).json(
            new ApiResponse(
                400,
                null,
                "Something went wrong while validating OTP"
            )
        );
    }
});

// Login User
const loginUser = asyncHandler( async ( req, res ) => {
    // extract details from body
    const { email, password } = req.body ;

    if(!email || !password){
        return res
        .status(400)
        .json(
            new ApiError(400,"email and password both are required to do sign-in.")
        )
    }

    // fetch user details from database
    const user = await User.findOne({ email });
    if(!user){
        return res
        .status(400)
        .json(
            new ApiError(400,"User does not exist!")
        )
    }

    // check whether the password is correct or not
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res
        .status(400)
        .json(
            new ApiError(400,"Invalid Credentials")
        )
    }

    // User is verified or not
    const isVerified = user.verified ;

    if(!isVerified){
        // generate OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();

        // send OTP on email
        /* TO DO */

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set : {
                    otp : otp,
                    otpExpiry : otpExpiry,
                }
            },
            {
                new  : true
            }
        ).select(
            "-password -refreshToken -otp -otpExpiry"
        );

        return res.status(200).json(
            new ApiResponse(200,updatedUser,"OTP has been sent Successfully!!")
        );
    }else{
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        if(!refreshToken || !accessToken){
            return res
            .status(400)
            .json(
                new ApiError(400,"Something Went Wrong while creating accessToken and refreshToken")
            )
        }

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken -otp -otpExpiry"
        );

        const options = {
            httpOnly: process.env.APP_ENV === 'production' ? true : false,  // Should be true for security purposes
            secure: process.env.APP_ENV === 'production' ? true : false,   // Set to false if you are testing over HTTP, true for HTTPS
            path: '/',       // Ensure cookies are available site-wide
            magAge: 60 * 60 * 1000,
            sameSite: 'None',
            domain: process.env.CORS_DOMAIN
        };

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200, loggedInUser,"User LoggedIn Successfully!")
        );
    }
});

// logout User
const logoutUser = asyncHandler( async ( req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req?.user?._id,
        {
            $set : {
                refreshToken : ''
            }
        },
        {
            new : true
        }
    );

    if(!updatedUser){
        return res
        .status(404)
        .json(
            new ApiError(404,"User Does not found")
        )
    }

    const options = {
        httpOnly: process.env.APP_ENV === 'production' ? true : false,  // Should be true for security purposes
        secure: process.env.APP_ENV === 'production' ? true : false,   // Set to false if you are testing over HTTP, true for HTTPS
        path: '/',       // Ensure cookies are available site-wide
        magAge: 60 * 60 * 1000,
        sameSite: 'None',
        domain: process.env.CORS_DOMAIN
    };

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User LoggedOut Successfully")
    )
});


export {
    registerUser,
    userVerification,
    regenerateOTP,
    loginUser,
    logoutUser,
    testServer
}