import { Schema, model } from "mongoose";

const moduleSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }
}, { timestamps: true });

const Module = model('Module', moduleSchema);

export default Module;