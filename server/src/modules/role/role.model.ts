import { Schema, model } from "mongoose";

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
    }
  },
  {
    timestamps: true,
  }
);

const Role = model("Role", roleSchema);

export default Role