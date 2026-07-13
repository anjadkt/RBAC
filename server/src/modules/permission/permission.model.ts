import { Schema, model } from "mongoose";

const permissionSchema = new Schema({

  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },

  operation: { type: Schema.Types.ObjectId, ref: 'Operation', required: true },

  code: { type: String, required: true, unique: true },

  label: { type: String },

  description: { type: String }

}, { timestamps: true });

permissionSchema.index({ module: 1, operation: 1 }, { unique: true });

const Permission = model("Permission", permissionSchema);

export default Permission;