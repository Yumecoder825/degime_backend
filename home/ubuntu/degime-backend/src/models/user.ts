import { Schema, model } from 'mongoose'
import { compareSync } from 'bcrypt'

import { IUser, IUserMethods, UserModel } from '@/contracts/user'

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: String,
    password: String,
    userId: {
      type: String,
      required: true
    },
    avatar: String,
    name: String,
    connectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    profileViewCount: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    },
    businessProfileLink: String,
    snsProfileLink: String,
    verifications: [{ type: Schema.Types.ObjectId, ref: 'Verification' }],
    resetPasswords: [{ type: Schema.Types.ObjectId, ref: 'ResetPassword' }]
  },
  { timestamps: true }
)

schema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password)
}

schema.methods.toJSON = function () {
  const obj = this.toObject()

  delete obj.password
  delete obj.verifications
  delete obj.resetPasswords

  return obj
}

export const User = model<IUser, UserModel>('User', schema)
