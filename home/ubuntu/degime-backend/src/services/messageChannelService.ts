import { ObjectId } from 'mongoose'

import { MessageChannel } from '@/models'

export const messageChannelService = {
  create: (
    {
      title,
      description,
      avatar = ''
    }: {
      title: string
      description: string
      avatar?: string
    },
    owner: ObjectId
  ) =>
    new MessageChannel({
      title,
      description,
      avatar,
      members: [owner],
      owner
    }).save(),

  getById: (id: ObjectId) => MessageChannel.findById(id),
  getByUser: (userId: ObjectId, channelId: ObjectId) => {
    return MessageChannel.findOne({ _id: channelId, members: { $in: [userId] } });
  },
  getByTitle: (title: string) => MessageChannel.findOne({ title }),
  getOwnedById: (id: ObjectId, owner: ObjectId) => MessageChannel.findOne({ _id: id, owner: owner }),

  deleteById: (id: ObjectId) => MessageChannel.deleteOne({ _id: id }),

  updateOne: (
    id: ObjectId,
    {
      title,
      description,
      avatar
    }: {
      title?: string
      description?: string
      avatar?: string
    },
  ) => {
    return MessageChannel.findOneAndUpdate({ _id: id }, { title, description, avatar }, { upsert: true })
  },
  getJoinedChannels: (userId: ObjectId) => {
    return MessageChannel.find({ members: { $in: [userId] } });
  },
}
