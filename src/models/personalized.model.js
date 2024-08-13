import mongoose, { Schema } from "mongoose";

const personalizedSchema = new Schema({
    type : {
        type : String,
        required : true
    },
    customData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, { timestamps : true });

export const Personalized = mongoose.model("Personalized",personalizedSchema);