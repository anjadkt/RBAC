import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    label : {
      type :String
    },

    module: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    isSystem : {
      type : Boolean,
      default : false
    },

    description: String,
  },
  {
    timestamps: true,
  }
);

const Permission = model("Permission", permissionSchema);

export default Permission ;