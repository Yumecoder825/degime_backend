import { Request, Response } from 'express'
import { ObjectId, startSession } from 'mongoose'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import moment from 'moment'

import {
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IParamsRequest,
  IUserRequest
} from '@/contracts/request'
import {
  DeleteProfilePayload,
  ProfileViewPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  UpdateUserBusinessProfilePayload,
  UpdateUserSnsProfilePayload,
  VerificationRequestPayload
} from '@/contracts/user'
import {
  mediaService,
  resetPasswordService,
  userService,
  verificationService,
  networkService
} from '@/services'
import { ExpiresInDays, MediaRefType } from '@/constants'
import { createDateAddDaysFromNow } from '@/utils/dates'
import { createCryptoString } from '@/utils/cryptoString'
import { UserMail } from '@/mailer'
import { jwtSign } from '@/utils/jwt'
import { createHash } from '@/utils/hash'
import { Image } from '@/infrastructure/image'
import { appUrl } from '@/utils/paths'

export const userController = {
  me: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ReasonPhrases.NOT_FOUND,
        status: StatusCodes.NOT_FOUND
      })
    }

    const media = await mediaService.findOneByRef({
      refType: MediaRefType.User,
      refId: user.id
    })

    let image
    if (media) {
      image = appUrl(await new Image(media).sharp({ width: 150, height: 150 }))
    }

    return res.status(StatusCodes.OK).json({
      data: { ...user.toJSON(), image },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },

  getUser: async (
    { params: { userId } }: IParamsRequest<string>,
    res: Response
  ) => {
    try {
      const userProfile = await userService.getUser(userId)
      if (!userProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      return res.status(StatusCodes.OK).json({
        data: userProfile,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {}
  },

  getUserById: async (
    { params }: IParamsRequest<{ userId: ObjectId }>,
    res:Response
  ) => {
    try {
      const userProfile = await userService.getById(params.userId);
      if (!userProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      return res.status(StatusCodes.OK).json({
        data: userProfile,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  verificationRequest: async (
    {
      context: { user },
      body: { email }
    }: ICombinedRequest<IUserRequest, VerificationRequestPayload>,
    res: Response
  ) => {
    const session = await startSession()

    try {
      if (user.email !== email) {
        const user = await userService.getByEmail(email)
        if (user) {
          return res.status(StatusCodes.CONFLICT).json({
            message: ReasonPhrases.CONFLICT,
            status: StatusCodes.CONFLICT
          })
        }
      }

      session.startTransaction()
      const cryptoString = createCryptoString()

      const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification)

      let verification =
        await verificationService.findOneAndUpdateByUserIdAndEmail(
          {
            userId: user.id,
            email,
            accessToken: cryptoString,
            expiresIn: dateFromNow
          },
          session
        )

      if (!verification) {
        verification = await verificationService.create(
          {
            userId: user.id,
            email,
            accessToken: cryptoString,
            expiresIn: dateFromNow
          },
          session
        )

        await userService.addVerificationToUser(
          {
            userId: user.id,
            verificationId: verification.id
          },
          session
        )
      }

      const userMail = new UserMail()

      userMail.verification({
        email: user.email,
        accessToken: cryptoString
      })

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  verification: async (
    { params }: IParamsRequest<{ accessToken: string }>,
    res: Response
  ) => {
    const session = await startSession()
    try {
      const verification = await verificationService.getByValidAccessToken(
        params.accessToken
      )

      if (!verification) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: ReasonPhrases.FORBIDDEN,
          status: StatusCodes.FORBIDDEN
        })
      }

      session.startTransaction()

      await userService.updateVerificationAndEmailByUserId(
        verification.user,
        verification.email,
        session
      )

      await verificationService.deleteManyByUserId(verification.user, session)

      const { accessToken } = jwtSign(verification.user)

      const userMail = new UserMail()

      userMail.successfullyVerified({
        email: verification.email
      })
      const user = await userService.getById(verification.user)
      networkService.addConnector(
        user?.id as ObjectId,
        user?.connectedBy as ObjectId
      )

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        data: { accessToken },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  increaseProfileViewCount: async (
    { params }: IParamsRequest<ProfileViewPayload>,
    res: Response
  ) => {
    try {
      const user = await userService.getById(params.userId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      user.profileViewCount += 1
      await user.save()

      return res.status(StatusCodes.OK).json({
        data: { profileViewCount: user.profileViewCount },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateProfile: async (
    {
      context: { user },
      body: { name }
    }: ICombinedRequest<IUserRequest, UpdateProfilePayload>,
    res: Response
  ) => {
    try {
      await userService.updateProfileByUserId(user.id, { name })

      const userMail = new UserMail()

      userMail.successfullyUpdatedProfile({
        email: user.email
      })

      return res.status(StatusCodes.OK).json({
        data: { name },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateUserProfile: async (
    {
      context: { user },
      body: { name }
    }: ICombinedRequest<IUserRequest, UpdateProfilePayload>,
    res: Response
  ) => {
    try {
      await userService.updateProfileByUserId(user.id, { name })

      const userMail = new UserMail()

      userMail.successfullyUpdatedProfile({
        email: user.email
      })

      return res.status(StatusCodes.OK).json({
        data: { name },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateUserBusinessProfileLink: async (
    {
      context: { user },
      body: { businessProfileLink }
    }: ICombinedRequest<IUserRequest, UpdateUserBusinessProfilePayload>,
    res: Response
  ) => {
    try {
      await userService.updateBusinessProfileLink(user.id, { businessProfileLink })

      const userMail = new UserMail()

      // userMail.successfullyUpdatedProfile({
      //   email: user.email
      // })

      return res.status(StatusCodes.OK).json({
        data: { businessProfileLink },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateUserSnsProfileLink: async (
    {
      context: { user },
      body: { snsProfileLink }
    }: ICombinedRequest<IUserRequest, UpdateUserSnsProfilePayload>,
    res: Response
  ) => {
    try {
      await userService.updateSnsProfileLink(user.id, { snsProfileLink })

      const userMail = new UserMail()

      // userMail.successfullyUpdatedProfile({
      //   email: user.email
      // })

      return res.status(StatusCodes.OK).json({
        data: { snsProfileLink },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateEmail: async (
    {
      context: { user },
      body: { email, password }
    }: ICombinedRequest<IUserRequest, UpdateEmailPayload>,
    res: Response
  ) => {
    const session = await startSession()

    try {
      if (user.email === email) {
        return res.status(StatusCodes.OK).json({
          data: { email },
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      }

      const isUserExist = await userService.isExistByEmail(email)

      if (isUserExist) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
        })
      }

      const currentUser = await userService.getById(user.id)

      const comparePassword = currentUser?.comparePassword(password)
      if (!comparePassword) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: ReasonPhrases.FORBIDDEN,
          status: StatusCodes.FORBIDDEN
        })
      }

      session.startTransaction()

      await userService.updateEmailByUserId(user.id, email, session)

      const cryptoString = createCryptoString()

      const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification)

      let verification =
        await verificationService.findOneAndUpdateByUserIdAndEmail(
          {
            userId: user.id,
            email,
            accessToken: cryptoString,
            expiresIn: dateFromNow
          },
          session
        )

      if (!verification) {
        verification = await verificationService.create(
          {
            userId: user.id,
            email,
            accessToken: cryptoString,
            expiresIn: dateFromNow
          },
          session
        )
      }

      await userService.addVerificationToUser(
        {
          userId: user.id,
          verificationId: verification.id
        },
        session
      )

      const userMail = new UserMail()

      userMail.successfullyUpdatedEmail({ email })

      userMail.verification({
        email,
        accessToken: cryptoString
      })

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        data: { email },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updatePassword: async (
    {
      context: {
        user: { email }
      },
      body: { oldPassword, newPassword }
    }: ICombinedRequest<IUserRequest, UpdatePasswordPayload>,
    res: Response
  ) => {
    try {
      const user = await userService.getByEmail(email)

      const comparePassword = user?.comparePassword(oldPassword)

      if (!user || !comparePassword) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: ReasonPhrases.FORBIDDEN,
          status: StatusCodes.FORBIDDEN
        })
      }

      const hashedPassword = await createHash(newPassword)

      await userService.updatePasswordByUserId(user.id, hashedPassword)

      const userMail = new UserMail()

      userMail.successfullyUpdatedPassword({ email: user.email })

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateAvatar: async (
    {
      context: { user },
      body: { imageId }
    }: ICombinedRequest<IUserRequest, { imageId: ObjectId }>,
    res: Response
  ) => {
    try {
      await userController.deleteUserImages({ userId: user.id })

      await mediaService.updateById(imageId, {
        refType: MediaRefType.User,
        refId: user.id
      })

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  deleteProfile: async (
    {
      context: {
        user: { email }
      },
      body: { password }
    }: ICombinedRequest<IUserRequest, DeleteProfilePayload>,
    res: Response
  ) => {
    const session = await startSession()

    try {
      const user = await userService.getByEmail(email)

      const comparePassword = user?.comparePassword(password)
      if (!user || !comparePassword) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: ReasonPhrases.FORBIDDEN,
          status: StatusCodes.FORBIDDEN
        })
      }
      session.startTransaction()

      await userService.deleteById(user.id, session)

      await resetPasswordService.deleteManyByUserId(user.id, session)

      await verificationService.deleteManyByUserId(user.id, session)

      const userMail = new UserMail()

      userMail.successfullyDeleted({ email: user.email })

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  deleteUserImages: async ({ userId }: { userId: ObjectId }) => {
    const images = await mediaService.findManyByRef({
      refType: MediaRefType.User,
      refId: userId
    })

    const promises = []

    for (let i = 0; i < images.length; i++) {
      promises.push(new Image(images[i]).deleteFile())
    }

    await Promise.all(promises)

    await mediaService.deleteManyByRef({
      refType: MediaRefType.User,
      refId: userId
    })
  },

  getUserCreatedInAMonth: async (
    { params }: IParamsRequest<{ accessToken: string }>,
    res: Response
  ) => {
    try {
      var currentDate = moment()
      var lastMonth = moment().subtract(1, 'months')

      const users = await userService.getByDate(lastMonth, currentDate)

      return res.status(StatusCodes.OK).json({
        data: users,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getAllUsers: async ({}, res: Response) => {
    try {
      const users = await userService.getAllUsers()
      if (users && users.length > 0)
        return res.status(StatusCodes.OK).json({
          data: users,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      else
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
    } catch (error) {
      winston.error(error)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
