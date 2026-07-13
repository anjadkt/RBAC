import { Schema, model } from "mongoose";
import { ROLE_LEVELS } from "./role.constant";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },

    description: String,

    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],

    isSystem: {
      type: Boolean,
      default: false
    },

    level: {
      type: Number,
      enum: ROLE_LEVELS,
      default: 100
    }
  },
  {
    timestamps: true,
  }
);

const Role = model("Role", roleSchema);

export default Role