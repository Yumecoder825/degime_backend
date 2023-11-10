import { Schema, model, Types } from 'mongoose'
import { IMessageChannel, IMessageChannelMethods, MessageChannelModel } from '@/contracts/messageChannel'

const schema = new Schema<IMessageChannel, MessageChannelModel, IMessageChannelMethods>(
    {
        title: String,
        description: String,
        avatar: String,
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const MessageChannel = model<IMessageChannel, MessageChannelModel>('MessageChannel', schema)
