import { Schema, model } from 'mongoose'
import { ISNSProfile, ISNSProfileMethods, SNSProfileModel } from '@/contracts/snsProfile'

const schema = new Schema<ISNSProfile, SNSProfileModel, ISNSProfileMethods>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        bannerImages: [String],
        profileType: String,
        backgroundColor: String,
        backgroundImage: String,
        profileLink: String,
        profileImage: String,
        accountName: String,
        profile: String,
        widgets: [Object]
    },
    { timestamps: true }
)

export const SnsProfile = model<ISNSProfile, SNSProfileModel>('SnsProfile', schema)
