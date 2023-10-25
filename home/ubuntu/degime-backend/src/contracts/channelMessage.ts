import { Model, ObjectId } from 'mongoose'

export interface IChannelMesssage {
  sentBy: ObjectId,
  messageChannel: ObjectId,
  message: string
}

export interface IChannelMessageMethods {
}

export type ChannelMessageModel = Model<IChannelMesssage, unknown, IChannelMessageMethods>

export type CreateChannelMessagePayload = Required<Omit<IChannelMesssage, 'sentBy'>>
export type GetChannelMessagePayload = {
  sentBy?: string
  messageChannel: string
  cursor?: string
  limit?: string | number
}
export type UpdateChannelMessagePayload = {
  id: ObjectId
  message: string
}
export type RemoveChannelMessagePayload = {
  id: ObjectId
}
