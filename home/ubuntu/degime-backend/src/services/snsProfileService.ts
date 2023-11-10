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
      const data = [{ user: userId }, { ...newParams, user: userId }];
      return SnsProfile.create(...data)
    }
  },
}
