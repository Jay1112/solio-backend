import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { generateOTP, getOTPExpiry } from '../utils/utilityFunctions.js';

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
     }else{
        return null;
     }
   } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token...");
   }
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
        throw new ApiError(400,"All Fields are required!");
    }

    // User already exists or not based on email and username
    const existedOne = await User.findOne({ $or : [ { username }, { email } ] });
    if(existedOne){
        throw new ApiError(409,"User Already Exists!");
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

    res.status(200).json(
        new ApiResponse(200,createdUser, "User Registered Successfully!")
    );
});

// Request for New OTP
const regenerateOTP = asyncHandler( async ( req, res) => {
    const { email, username } = req.body ;

    if(!email && !username){
        throw new ApiError(400,"email or username is required to verify user.");
    }

    const user = await User.findOne({ $or : [ { username }, { email } ] });
    if(!user){
        throw new ApiError(409,"User Not Found");
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

    res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "New OTP Successfully Generated!!"
        )
    );
});

// Verify User using OTP
const userVerification = asyncHandler( async (req, res) => {
    try{
        const { email, username, otp } = req.body ;

        if(!email && !username){
            throw new ApiError(400,"email or username is required to verify user.");
        }

        if(!otp){
            throw new ApiError(400,"OTP is required to verify user.");
        }

        const user = await User.findOne({ $or : [ { username }, { email } ] });
        if(!user){
            throw new ApiError(409,"User Not Found");
        }

        const currentTime = Date.now();
        if(user.otp === otp && currentTime <= user.otpExpiry ){
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
            
            res.status(200).json(
                new ApiResponse(
                    200,
                    updatedUser,
                    "OTP Successfully Verified"
                )
            );

        }else if(user.otp !== otp){
            res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "Invalid OTP!"
                )
            );
        }else if(currentTime > user.otpExpiry){
            res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "OTP is expired! Try to create new one"
                )
            );
        }else{
            res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "Something went wrong while validating OTP"
                )
            );
        }
    }catch(error){
        throw new ApiError(500,"Something went wrong while verifing User...", error);
    }
});

// Login User
const loginUser = asyncHandler( async ( req, res ) => {
    // extract details from body
    const { email, password } = req.body ;

    if(!email || !password){
        throw new ApiError(400,"email and password are required to login");
    }

    // fetch user details from database
    const user = await User.findOne({ email });
    if(!user){
        throw new ApiError(400,"User does not exist!");
    }

    // check whether the password is correct or not
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Wrong Password");
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

        res.status(200).json(
            new ApiResponse(200,updatedUser,"OTP has been sent Successfully!!")
        );
    }else{
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken -otp -otpExpiry"
        );

        const options = {
            httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200, loggedInUser,"User LoggedIn Successfully!")
        );
    }
});



export {
    registerUser,
    userVerification,
    regenerateOTP,
    loginUser
}