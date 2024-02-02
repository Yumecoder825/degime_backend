import { ClientSession, ObjectId } from 'mongoose'

import { User } from '@/models'

export const userService = {
  create: (
    {
      email,
      password,
      userId,
      connectedBy,
      verified = false,
    }: {
      email: string
      password: string
      userId: string
      connectedBy?: ObjectId
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new User({
      email,
      password,
      verified,
      userId,
      connectedBy
    }).save({ session }),

  getById: (userId: ObjectId) => User.findById(userId),

  getByDate: (from: any, to: any) => User.find({createdAt:{$gte:from, $lt:to}}),

  getByEmail: (email: string) => User.findOne({ email }),

  isExistByEmail: (email: string) => User.exists({ email }),

  isExistByUserId: (userId: string) => User.exists({ userId }),

  updatePasswordByUserId: (
    userId: ObjectId,
    password: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { password, resetPasswords: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateVerificationAndEmailByUserId: (
    userId: ObjectId,
    email: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { email, verified: true, verifications: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateProfileByUserId: (
    userId: ObjectId,
    { name }: { name: string; },
    session?: ClientSession
  ) => {
    console.log(name);
    const data = [{ _id: userId }, { name }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateBusinessProfileLink: (
    userId: ObjectId,
    { businessProfileLink }: { businessProfileLink: string; },
    session?: ClientSession
  ) => {
    console.log(businessProfileLink);
    const data = [{ _id: userId }, { businessProfileLink }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateSnsProfileLink: (
    userId: ObjectId,
    { snsProfileLink }: { snsProfileLink: string; },
    session?: ClientSession
  ) => {
    console.log(snsProfileLink);
    const data = [{ _id: userId }, { snsProfileLink }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateUserProfile: (
    userId: ObjectId,
    { name }: { name: string; },
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { name }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateEmailByUserId: (
    userId: ObjectId,
    email: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { email, verified: false }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  deleteById: (userId: ObjectId, session?: ClientSession) =>
    User.deleteOne({ user: userId }, { session }),

  addResetPasswordToUser: async (
    {
      userId,
      resetPasswordId
    }: {
      userId: ObjectId
      resetPasswordId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.resetPasswords) {
        user.resetPasswords = []
      }
      user.resetPasswords.push(resetPasswordId)
      await user.save({ session })
    }
  },

  addVerificationToUser: async (
    {
      userId,
      verificationId
    }: {
      userId: ObjectId
      verificationId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.verifications) {
        user.verifications = []
      }
      user.verifications.push(verificationId)
      await user.save({ session })
    }
  },

  getAllUsers: async () => {
    const users = await User.find({});
    return users;
  },

  getUser: async (userId: string) => {
    const user = await User.findOne({userId: userId});
    return user;
  }
}
