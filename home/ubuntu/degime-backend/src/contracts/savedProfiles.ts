import { Model, ObjectId } from 'mongoose'

export type ProfilesProps = {
  profileOwner?: string,
  folderType?: string,
  profileType?: string,
}

export interface ISavedProfiles {
  user: ObjectId,
  profiles: ProfilesProps[]
}

export interface ISavedProfilePayload {
  from_id: string // user id
  from_name: string
  to: string // user id
  profile_type: string,
  // file: string,
  // message: string
}

export interface ISavedProfilesMethods {
}

export type savedProfilesPayload = Partial<ProfilesProps>

export type SavedProfilesModel = Model<ISavedProfiles, unknown, ISavedProfilesMethods>
