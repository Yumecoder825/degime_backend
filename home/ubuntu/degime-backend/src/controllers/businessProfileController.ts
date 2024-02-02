import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import {
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { businessProfileService, userService } from '@/services'
import { IProfileChangePayload, UpdateBusinessProfilePayload } from '@/contracts/businessProfile'
import { ObjectId } from 'mongoose'
import { UpdateUserBusinessProfilePayload, UpdateUserSnsProfilePayload } from '@/contracts/user'
import { NextFunction } from 'express-serve-static-core'

export const businessProfileController = {
  createOrUpdateBusinessProfile: async (
    {
      context: { user },
      body: { ...values }
    }: ICombinedRequest<IUserRequest, UpdateBusinessProfilePayload>,
    res: Response,
    next: NextFunction,
    ioFn: (data: IProfileChangePayload) => void
  ) => {
    try {
      const businessProfile = await businessProfileService.createOrUpdate(
        user.id,
        values
      )

      await userService.updateProfileByUserId(user.id, {
        name: values.name || ''
      })

      ioFn({ from_name: user.name || '', from_id: user.userId, profile_link: values.profileLink || '', profile_type: 'business' })

      if (businessProfile) {
        await userService.updateBusinessProfileLink(user.id, {businessProfileLink: values.profileLink || ''});
        return res.status(StatusCodes.OK).json({
          data: businessProfile, // Corrected data property to include businessProfiles
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      } else {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
        })
      }
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getBusinessProfile: async (
    { params: { profileLink } }: any,
    res: Response
  ) => {
    try {
      const businessProfile = await businessProfileService.getBusinessProfile(
        profileLink
      )

      if (businessProfile === null) {
        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      } else {
        return res.status(StatusCodes.OK).json({
          data: businessProfile, // Corrected data property to include businessProfiles
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      }
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getOwnBusinessProfile: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const businessProfile =
        await businessProfileService.getOwnBusinessProfile(user.id)
      if (!businessProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      return res.status(StatusCodes.OK).json({
        data: businessProfile,
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

  updateBusinessProfileLink: async (
    {
      context: { user },
      body: { businessProfileLink }
    }: ICombinedRequest<IUserRequest, UpdateUserBusinessProfilePayload>,
    res: Response
  ) => {
    try {
      const flag = await businessProfileService.checkProfileLink(
        businessProfileLink
      )
      if (flag === false) {
        const updateBusinessProfile =
          await businessProfileService.updateBusinessProfileLink(
            user.id,
            businessProfileLink
          )
          await userService.updateBusinessProfileLink(user.id, {businessProfileLink});
        return res.status(StatusCodes.OK).json({
          data: updateBusinessProfile,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      } else
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
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
