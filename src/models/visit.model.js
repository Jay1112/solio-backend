import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
    visitId : {
        type : String,
        required : true,
        trim : true
    },
    count : {
        type : Number,
        required : true,
    }
}, { timestamps : true });

export const Visit = mongoose.model("Visit",visitSchema);