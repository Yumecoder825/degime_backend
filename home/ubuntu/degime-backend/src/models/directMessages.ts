import { Schema, model, Types } from 'mongoose'
import { IDirectMessage, IDirectMessageMethods, DirectMessageModel } from '@/contracts/directMessage'
// @ts-ignore
import MongoPaging from 'mongo-cursor-pagination';

const schema = new Schema<IDirectMessage, DirectMessageModel, IDirectMessageMethods>(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        channelId: String,
        message: String,
    },
    {
        timestamps: {
            createdAt: 'sentAt'
        }
    }
)

schema.plugin(MongoPaging.mongoosePlugin)


schema.methods.toJSON = function () {
    const obj = this.toObject()
    return obj
}
export const DirectMessages = model<IDirectMessage, DirectMessageModel>('DirectMessage', schema)
