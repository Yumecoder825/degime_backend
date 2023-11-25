import { Schema, model } from 'mongoose'
// import { INetwork, INetworkMethods, NetworkModel } from '@/contracts/network'
import { ISavedProfiles, ISavedProfilesMethods, SavedProfilesModel } from '@/contracts/savedProfiles'

const schema = new Schema<ISavedProfiles, ISavedProfilesMethods, SavedProfilesModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        profiles: [Object],
    },
    { timestamps: true }
)

export const SavedProfiles = model<ISavedProfiles, SavedProfilesModel>('SavedProfiles', schema)
