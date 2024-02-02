import { ObjectId, Types } from 'mongoose'
import { DirectMessages } from '@/models'
import { IDirectMessage } from '@/contracts/directMessage';
import { getDirectChannelId } from '@/utils/direct-message';

export const directMessageService = {
  create: (
    from: ObjectId,
    to: ObjectId,
    message: string,
    file: string,
  ) => {
    const channelId = getDirectChannelId(from, to);
    return new DirectMessages({
      from: from,
      to: to,
      channelId,
      message: message,
      file: file
    }).save()
  },
  update: (
    id: ObjectId,
    message: IDirectMessage['message']
  ) => {
    return DirectMessages.findOneAndUpdate({ _id: id }, { message: message })
  },
  getMessages: async (limit: number, from: string, to: string, cursor?: string) => {
    const channelId = getDirectChannelId(from, to);

    if (cursor) {
      // @ts-ignore
      let result = await DirectMessages.paginate({
        query: {
          channelId: channelId,
        },
        fields: {
          timestamp :1
        },
        limit: limit,
        next: cursor, // This queries the next page
      });
      return result;
    } else {
      // @ts-ignore
      let result = await DirectMessages.paginate({
        query: {
          channelId: channelId,
        },
        fields: {
          timestamp :1
        },
        limit: limit,
      });
      return result;
    }
  },
  getById: (messageId: ObjectId) => DirectMessages.findById(messageId),
  deleteById: (messageId: ObjectId) => DirectMessages.deleteOne({ _id: messageId }),
}
