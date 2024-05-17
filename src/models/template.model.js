import mongoose, { Schema } from "mongoose";

const templateSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    }
}, { timestamps : true });

export const Template = mongoose.model("Template",templateSchema);