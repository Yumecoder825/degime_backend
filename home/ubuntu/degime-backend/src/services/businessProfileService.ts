import { ObjectId } from 'mongoose'
import { BusinessProfile } from '@/models'
import { UpdateBusinessProfilePayload } from '@/contracts/businessProfile'

export const businessProfileService = {
  create: async (
    userId: ObjectId,
    profileLink: string,
    newParams: UpdateBusinessProfilePayload
  ) => {
    const exitingProfile = await BusinessProfile.findOne({
      profileLink: profileLink
    }).exec()

    if (exitingProfile) {

    } else {
      // create
      const data = [{ ...newParams, user: userId }]
      console.log("test=>>>>>>>>>>>>>", data);
      return BusinessProfile.create(...data)
    }
  },

  getBusinessProfile: async (businessProfileLink: string) => {

    const businessProfile = await BusinessProfile.findOne({
      profileLink: businessProfileLink
    }).exec()
    return businessProfile
  },

  getBusinessProfiles: async (userId: ObjectId,) => {
    const businessProfiles = await BusinessProfile.find({
      user: userId
    }).exec()

    return businessProfiles
  }
}
