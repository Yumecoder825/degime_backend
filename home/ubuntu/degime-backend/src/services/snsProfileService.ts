import { ObjectId } from 'mongoose'

import { SnsProfile } from '@/models'
import { UpdateSNSProfilePayload } from '@/contracts/snsProfile'

export const snsProfileService = {
  createOrUpdate: async(
    userId: ObjectId,
    newParams: UpdateSNSProfilePayload
  ) => {
    const exitingProfile = await SnsProfile.findOne({ user: userId }).exec();

    if(exitingProfile) { // update
      const data = [{ _id: exitingProfile._id }, { ...newParams, user: userId }]
      return SnsProfile.updateOne(...data)
    } else { // create
      const data = [{ ...newParams, user: userId }];
      return SnsProfile.create(...data)
    }
  },

  getOwnSNSProfile: async (userId: ObjectId,) => {
    const snsProfile = await SnsProfile.findOne({
      user: userId
    }).exec()
    return snsProfile
  },


  getSNSProfile: async (snsProfileLink: string) => {

    const snsProfile = await SnsProfile.findOne({
      profileLink: snsProfileLink
    }).exec()
    return snsProfile
  },

  updateSnsProfileLink: async (userId: ObjectId, newSnsProfileLink: string) => {

    const snsProfile = await SnsProfile.findOne({
      user: userId
    }).exec()

    if(!snsProfile)
      return null;
    snsProfile.profileLink = newSnsProfileLink;
    const updateSnsProfile = await snsProfile.save();
    
    return updateSnsProfile;
  },
}
