import { savedProfilesPayload } from '@/contracts/savedProfiles'
import { BusinessProfile, SnsProfile } from '@/models'
import { SavedProfiles } from '@/models/savedProfiles'
import { ObjectId } from 'mongoose'

class SavedProfilesService {
  create(userId: ObjectId, savedProfile?: savedProfilesPayload) {
    const savedProfiles: savedProfilesPayload[] = []
    if (savedProfile) {
      savedProfiles.push(savedProfile)
    }
    return new SavedProfiles({
      user: userId,
      savedProfile: savedProfile
    }).save()
  }

  async getByUserId(userId: ObjectId) {
    let savedProfile = await SavedProfiles.findOne({ user: userId })
    if (!savedProfile) {
      savedProfile = await this.create(userId)
    }
    return savedProfile
  }

  async getSavedPublicProfiles(userId: ObjectId) {
    const savedProfile = await this.getByUserId(userId)
    const publicBusinessProfileUsers = savedProfile.profiles
      .filter(
        profile =>
          profile.folderType === 'public' && profile.profileType === 'business'
      )
      .map(profile => profile.profileOwner)

    const publicSnsProfileUsers = savedProfile.profiles
      .filter(
        profile =>
          profile.folderType === 'public' && profile.profileType === 'sns'
      )
      .map(profile => profile.profileOwner)
    const savedBusinessProfiles = await BusinessProfile.find({
      user: { $in: publicBusinessProfileUsers }
    })

    const savedSnsProfiles = await SnsProfile.find({
      user: { $in: publicSnsProfileUsers }
    })

    return { savedBusinessProfiles, savedSnsProfiles }
  }

  async getSavedPrivateProfiles(userId: ObjectId) {
    const savedProfile = await this.getByUserId(userId)
    const privateBusinessProfileOwners = savedProfile.profiles
      .filter(
        profile =>
          profile.folderType === 'private' && profile.profileType === 'business'
      )
      .map(profile => profile.profileOwner)

    const privateSnsProfileUsers = savedProfile.profiles
      .filter(
        profile =>
          profile.folderType === 'private' && profile.profileType === 'sns'
      )
      .map(profile => profile.profileOwner)

    const savedBusinessProfiles = await BusinessProfile.find({
      user: { $in: privateBusinessProfileOwners }
    })

    const savedSnsProfiles = await SnsProfile.find({
      user: { $in: privateSnsProfileUsers }
    })

    return { savedBusinessProfiles, savedSnsProfiles }
  }

  async saveProfile(userId: ObjectId, profile: savedProfilesPayload) {
    const savedProfiles = await this.getByUserId(userId)
    savedProfiles.profiles.push(profile)
    await savedProfiles.save()
    return profile
  }
}

export const savedProfilesService = new SavedProfilesService()
