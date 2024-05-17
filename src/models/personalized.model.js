import mongoose, { Schema } from "mongoose";

const personalizedSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String
    },
    link : {
        type : String,
    },
    linkIcon : {
        type : String,
        trim : true
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

export const Personalized = mongoose.model("Personalized",personalizedSchema);