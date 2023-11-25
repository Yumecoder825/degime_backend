import { Schema, model } from 'mongoose'
import { ChannelMessageModel, IChannelMessageMethods, IChannelMesssage } from '@/contracts/channelMessage'
// @ts-ignore
import MongoPaging from 'mongo-cursor-pagination';

const schema = new Schema<IChannelMesssage, ChannelMessageModel, IChannelMessageMethods>(
    {
        sentBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        messageChannel: {
            type: Schema.Types.ObjectId,
            ref: 'MessageChannel'
        },
        file: String,
        message: String,
    },
    { timestamps: true }
)

schema.plugin(MongoPaging.mongoosePlugin)

export const ChannelMessage = model<IChannelMesssage, ChannelMessageModel>('ChannelMessage', schema)
