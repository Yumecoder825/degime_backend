import { Model, ObjectId, Types } from 'mongoose'

export interface IVerification {
  email: string
  accessToken: string
  expiresIn: Date
  user: ObjectId
}

export interface IResetPassword {
  accessToken: string
  expiresIn: Date
  user: ObjectId
}

export interface IUser {
  id: ObjectId
  email: string
  password: string
  userId: string
  name?: string
  connectedBy?: ObjectId | Types.ObjectId
  verified: boolean
  profileViewCount: number
  verifications?: ObjectId[]
  resetPasswords?: ObjectId[]
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean
}

export type UserModel = Model<IUser, unknown, IUserMethods>

export type VerificationRequestPayload = Pick<IUser, 'email'>

export type UpdateProfilePayload = Required<
  Pick<IUser, 'name'>
>

export type UpdateEmailPayload = Pick<IUser, 'email' | 'password'>

export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface DeleteProfilePayload {
  password: string
}

export type ProfileViewPayload = {
  userId: ObjectId
}
