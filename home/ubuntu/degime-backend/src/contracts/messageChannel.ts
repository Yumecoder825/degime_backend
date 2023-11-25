import { Model, ObjectId } from 'mongoose'

export interface IMessageChannel {
  title: string;
  description: string;
  avatar: string;
  owner: ObjectId
  members: ObjectId[];
}

export interface IMessageChannelMethods {
  paginate: (options: any) => any
}

export type MessageChannelModel = Model<IMessageChannel, unknown, IMessageChannelMethods>

export type CreateMessageChannelPayload = Required<
  Pick<IMessageChannel, 'title' | 'description'>
> & {
  avatar?: IMessageChannel['avatar']
}

export type UpdateMessageChannelPayload = Partial<Omit<IMessageChannel, 'owner' | 'members'>> & {
  id: ObjectId
}

export type AddUser2ChannelPayload = {
  channelId: ObjectId;
  userId: ObjectId;
}