import { Schema, model } from 'mongoose'
import { ISNSProfile, ISNSProfileMethods, SNSProfileModel } from '@/contracts/snsProfile'

const schema = new Schema<ISNSProfile, SNSProfileModel, ISNSProfileMethods>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        image: String,
        accountName: String,
        profile: String,
        widgets: [Object]
    },
    { timestamps: true }
)

export const SnsProfile = model<ISNSProfile, SNSProfileModel>('SnsProfile', schema)
