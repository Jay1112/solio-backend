import mongoose, { Schema } from "mongoose";

const socialSchema = new Schema({
    link : {
        type : String,
        required : true,
        trim : true
    },
    platform : {
        type : Schema.Types.ObjectId,
        ref : "Platform"
    },
    order : {
        type : Number,
        required : true,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, { timestamps : true });

export const Social = mongoose.model("Social",socialSchema);