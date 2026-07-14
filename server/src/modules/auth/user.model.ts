import { model, Schema, Types } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: {
      type: Types.ObjectId,
      ref: "Role"
    },
    isSuperAdmin: {
      type: Boolean
    },
    refreshToken: String,

    isActive: {
      type: Boolean,
      default: false
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expires: 0 },
    }
  },
  { timestamps: true },
)

userSchema.index({ isSuperAdmin: 1 }, { unique: true, partialFilterExpression: { isSuperAdmin: true } })

const User = model('User', userSchema)

export default User
