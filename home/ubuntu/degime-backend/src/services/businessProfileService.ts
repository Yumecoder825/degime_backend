import { ObjectId } from 'mongoose'
import { BusinessProfile, SnsProfile, User } from '@/models'
import { UpdateBusinessProfilePayload } from '@/contracts/businessProfile'

export const businessProfileService = {
  createOrUpdate: async (
    userId: ObjectId,
    newParams: UpdateBusinessProfilePayload
  ) => {
    const exitingProfile = await BusinessProfile.findOne({
      user: userId
    }).exec()

    if (exitingProfile) {
      const data = [{ _id: exitingProfile._id }, { ...newParams, user: userId }]
      return BusinessProfile.updateOne(...data)
    } else {
      // create
      const data = [{ ...newParams, user: userId }]
      return BusinessProfile.create(...data)
    }
  },

  getBusinessProfile: async (businessProfileLink: string) => {

    const businessProfile = await BusinessProfile.findOne({
      profileLink: businessProfileLink
    }).exec()
    return businessProfile
  },

  getOwnBusinessProfile: async (userId: ObjectId,) => {
    const businessProfile = await BusinessProfile.findOne({
      user: userId
    }).exec()
    return businessProfile
  },

  checkProfileLink: async (profileLink: string) => {
    const businessProfile = await BusinessProfile.findOne({profileLink: profileLink}).exec();
    if(businessProfile)
      return true;
    else {
      const snsProfile = await SnsProfile.findOne({ profileLink: profileLink }).exec();
      if(snsProfile)
        return true;
      else {
        const user = await User.findOne({ userId: profileLink }).exec();
        if(user)
          return true
        else
          return false
      }
    }
  },

  updateBusinessProfileLink: async (userId: ObjectId, newBusinessProfileLink: string) => {
    
    const businessProfile = await BusinessProfile.findOne({
      user: userId
    }).exec()
    
    if(!businessProfile)
      return null;
    businessProfile.profileLink = newBusinessProfileLink;
    const updateBusinessProfile = await businessProfile.save();
    
    return updateBusinessProfile;
  },
}
