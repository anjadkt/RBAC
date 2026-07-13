import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    module: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    description: String,
  },
  {
    timestamps: true,
  }
);

const Permission = model("Permission", permissionSchema);

export default Permission ;