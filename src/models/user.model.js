import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        index : true,
        lowercase : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String,
    },
    fullname : {
        type : String,
    },
    location : {
        type : String,
    },
    description : {
        type : String,
    },
    avatar : {
        type : String,
    },
    template : {
        type : Schema.Types.ObjectId,
        ref : "Template"
    },
    verified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : Number,
        default : null,
        min: 111111,
        max: 999999
    },
    otpExpiry : {
        type : Number,
        default : null
    }
},{ timestamps : true });

// run this middleware before we save the data in database
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// is password correct
userSchema.methods.isPasswordCorrect = async function(password){
    const isCorrectPassword = await bcrypt.compare(password,this.password);
    return isCorrectPassword;
};

// generate access token 
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            password : this.password,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    );
} 

// generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);