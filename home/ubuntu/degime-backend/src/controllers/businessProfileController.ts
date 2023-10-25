import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IContextRequest, IUserRequest } from '@/contracts/request'
import { businessProfileService } from '@/services'
import { UpdateBusinessProfilePayload } from '@/contracts/businessProfile'
import { ObjectId } from 'mongoose'

export const businessProfileController = {
  createBusinessProfile: async (
    {
      context: { user },
      body: { ...values }
    }: ICombinedRequest<IUserRequest, UpdateBusinessProfilePayload>,
    res: Response
  ) => {
    try {
      const businessProfile = await businessProfileService.create(
        user.id,
        values.profileLink || '',
        values
      )

      if (businessProfile) {
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
    { params: { businessProfileLink } }: any,
    res: Response
  ) => {
    try {
      const businessProfile = await businessProfileService.getBusinessProfile(
        businessProfileLink
      )

      if (businessProfile === null) {
        return res.status(StatusCodes.NOT_FOUND).json({
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

  getBusinessProfiles: async (
    {
      context: { user },
    }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const businessProfiles = await businessProfileService.getBusinessProfiles(
        user.id
      )
      if (!businessProfiles) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: ReasonPhrases.NOT_FOUND,
            status: StatusCodes.NOT_FOUND
        })
      }
      return res.status(StatusCodes.OK).json({
          data: businessProfiles,
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
  }
}
