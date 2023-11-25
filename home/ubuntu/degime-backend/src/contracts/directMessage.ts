import { Model, ObjectId } from 'mongoose'

export interface IDirectMessage {
  from: ObjectId // user id
  to: ObjectId // user id
  file: string
  channelId: string
  message: string
}

export interface IDirectMessageMethods {
  paginate: (options: any) => any
}

export type DirectMessageModel = Model<IDirectMessage, unknown, IDirectMessageMethods>


export interface IDirectMessagePayload {
  from: string // user id
  to: string // user id
  file: string,
  message: string
}

export type SendDirectMessagePayload = Required<Pick<IDirectMessage, 'to' | 'message' | 'file'>>
export type UpdateDirectMessagePayload = Required<Pick<IDirectMessage, 'message'>> & {
  id: ObjectId
}
export type RemoveDirectMessagePayload = {
  id: ObjectId
}

export type GetDirectMessagePayload = {
  from: string // user id
  to: string // user id
  limit?: string | number;
  cursor?: string;
}
