import mongoose, { Schema } from "mongoose";

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
        required : true
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
        required: true,
        min: 111111,
        max: 999999
    },
    otpExpiry : {
        type : Number,
        default : null
    }
},{ timestamps : true });

export const User = mongoose.model("User",userSchema);