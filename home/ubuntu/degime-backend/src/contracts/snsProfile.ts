import { Model, ObjectId } from 'mongoose'
import { Widget } from './profile'

export interface ISNSProfile {
  id: ObjectId
  user: ObjectId // user id
  image: string,
  accountName: string
  profile: string
  widgets: Widget[]
}

export interface ISNSProfileMethods {
}

export type SNSProfileModel = Model<ISNSProfile, unknown, ISNSProfileMethods>

export type UpdateSNSProfilePayload = Partial<Omit<ISNSProfile, 'id' | 'user'>>
