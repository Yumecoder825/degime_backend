import { Schema, model } from 'mongoose'
import { IBusinessProfile, IBusinessProfileMethods, BusinessProfileModel } from '@/contracts/businessProfile'

const schema = new Schema<IBusinessProfile, BusinessProfileModel, IBusinessProfileMethods>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        profileType: String,
        profileLink: String,
        name: String,
        backgroundColor: String,
        backgroundImage: String,
        contact1: {
            contact_type: String,
            contact_info: String,
        },
        contact2: {
            contact_type: String,
            contact_info: String,
        },
        contact3: {
            contact_type: String,
            contact_info: String,
        },
        contact4: {
            contact_type: String,
            contact_info: String,
        },
        profile: String,
        profileImage: String,
        bannerImage: [String],
        companyName: String,
        position: String,
        phone: String,
        mobile: String,
        email: String,
        address: String,
        widgets: [Object]
    },
)

export const BusinessProfile = model<IBusinessProfile, BusinessProfileModel>('BusinessProfile', schema)
