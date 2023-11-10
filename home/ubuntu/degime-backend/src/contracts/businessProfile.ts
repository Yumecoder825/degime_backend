import { Model, ObjectId } from 'mongoose'
import { Widget } from './profile'

export type Contact = {
  contact_type: string,
  contact_info: string,
}

export interface IBusinessProfile {
  user: ObjectId,
  profileType: string,
  profileLink: string,
  backgroundColor: string,
  backgroundImage: string,
  name: string,
  contact1: Contact
  contact2: Contact
  contact3: Contact
  contact4: Contact
  profileImage: string
  bannerImage: string[]
  profile: string
  companyName: string
  position: string
  phone: string
  mobile: string
  email: string
  address: string
  widgets: Widget[]
}

export interface IBusinessProfileMethods {
}

export type BusinessProfileModel = Model<IBusinessProfile, unknown, IBusinessProfileMethods>

export type UpdateBusinessProfilePayload = Partial<IBusinessProfile>

