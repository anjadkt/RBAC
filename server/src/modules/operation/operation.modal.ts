import { model, Schema } from "mongoose";

const operationSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
}, { timestamps: true });

const Operation = model("Operation", operationSchema);

export default Operation;