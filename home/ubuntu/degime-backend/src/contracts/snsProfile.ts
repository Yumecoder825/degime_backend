import { Model, ObjectId } from 'mongoose'
import { Widget } from './profile'

export interface ISNSProfile {
  user: ObjectId // user id
  profileType: string,
  profileLink: string,
  backgroundColor: string,
  backgroundImage: string,
  bannerImages: string[],
  profileImage: string,
  accountName: string
  profile: string
  widgets: Widget[]
}

export interface ISNSProfileMethods {
}

export type SNSProfileModel = Model<ISNSProfile, unknown, ISNSProfileMethods>

export type UpdateSNSProfilePayload = Partial<Omit<ISNSProfile, 'id' | 'user'>>
