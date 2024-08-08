import mongoose, { Schema } from "mongoose";

const socialSchema = new Schema({
    link : {
        type : String,
        required : true,
        trim : true
    },
    platform : {
        type : Schema.Types.ObjectId,
        ref : "Platform",
        required : true
    },
    order : {
        type : Number,
        required : false,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
}, { timestamps : true });

export const Social = mongoose.model("Social",socialSchema);