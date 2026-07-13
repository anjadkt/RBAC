import { model, Schema, Types } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role : {
      type : Types.ObjectId,
      ref : "Role"
    },
    isSuperAdmin : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true },
)

const User = model('User', userSchema)

export default User
