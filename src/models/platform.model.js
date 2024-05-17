import mongoose, { Schema } from "mongoose";

const platformSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    icon : {
        type : String,
        required : true
    }
}, { timestamps : true });

export const Platform = mongoose.model("Platform",platformSchema);