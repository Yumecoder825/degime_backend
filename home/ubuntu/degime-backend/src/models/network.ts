import { Schema, model } from 'mongoose'
import { INetwork, INetworkMethods, NetworkModel } from '@/contracts/network'

const schema = new Schema<INetwork, NetworkModel, INetworkMethods>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        connectors: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    { timestamps: true }
)

export const Network = model<INetwork, NetworkModel>('Network', schema)
