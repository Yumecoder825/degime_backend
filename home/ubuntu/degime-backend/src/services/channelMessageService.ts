import { ObjectId, Types } from 'mongoose'
import { ChannelMessage } from '@/models'
import { IChannelMesssage } from '@/contracts/channelMessage';

export const channelMessageService = {
  create: (msg: IChannelMesssage) => {
    return new ChannelMessage({
      message: msg.message,
      sentBy: msg.sentBy,
      file: msg.file,
      messageChannel: msg.messageChannel
    }).save()
  },
  update: (
    id: ObjectId,
    message: string
  ) => {
    return ChannelMessage.findOneAndUpdate({ _id: id }, { message: message })
  },
  getById: (msgId: ObjectId, sentBy: ObjectId) => ChannelMessage.findOne({ _id: msgId, sentBy: sentBy }),
  getMessages: async (channelId: string, sentBy?: string, cursor?: string, limit: number = 50) => {
    const query = {
      messageChannel: new Types.ObjectId(channelId)
    };
    if(sentBy){
      // @ts-ignore
      query.sentBy = new Types.ObjectId(sentBy)
    }
    if (cursor) {
      // @ts-ignore
      let result = await ChannelMessage.paginate({
        query,
        fields: {
          timestamp :1
        },
        limit: limit,
        next: cursor, // This queries the next page
      });
      return result;
    } else {
      // @ts-ignore
      let result = await ChannelMessage.paginate({
        query,
        fields: {
          timestamp :1
        },
        limit: limit,
      });
      return result;
    }
  },
  deleteById: (id: ObjectId) => ChannelMessage.deleteOne({ _id: id }),
}
