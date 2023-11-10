import { ObjectId } from 'mongoose'
import { IUser } from './user'

export type SignInPayload = Pick<IUser, 'email' | 'password'>

export type SignUpPayload = Pick<IUser, 'email' | 'password' | 'userId'>
export type SignUpQueryPayload = {
    connectedBy?: ObjectId
}

export type ResetPasswordPayload = Pick<IUser, 'email'>

export type NewPasswordPayload = Pick<IUser, 'password'>
