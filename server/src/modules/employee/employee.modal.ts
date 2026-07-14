import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Employee = model('Employee', employeeSchema);