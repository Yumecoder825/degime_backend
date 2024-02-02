import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import {
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { UpdateSNSProfilePayload } from '@/contracts/snsProfile'
import { businessProfileService, snsProfileService, userService } from '@/services'
import { UpdateUserSnsProfilePayload } from '@/contracts/user'

export const snsProfileController = {
  createOrUpdateSNSProfile: async (
    {
      context: { user },
      body: { ...params }
    }: ICombinedRequest<IUserRequest, UpdateSNSProfilePayload>,
    res: Response
  ) => {
    try {
      await snsProfileService.createOrUpdate(user.id, { ...params })
      await userService.updateSnsProfileLink(user.id, {snsProfileLink: params.profileLink || ''});
      return res.status(StatusCodes.OK).json({
        data: { ...params },
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

  getSNSProfile: async ({ params: { profileLink } }: any, res: Response) => {
    try {
      const snsProfile = await snsProfileService.getSNSProfile(profileLink)

      if (snsProfile === null) {
        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      } else {
        return res.status(StatusCodes.OK).json({
          data: snsProfile, // Corrected data property to include businessProfiles
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

  getOwnSNSProfile: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const snsProfile = await snsProfileService.getOwnSNSProfile(user.id)
      if (!snsProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      return res.status(StatusCodes.OK).json({
        data: snsProfile,
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
  updateSNSProfileLink: async (
    {
      context: { user },
      body: { snsProfileLink }
    }: ICombinedRequest<IUserRequest, UpdateUserSnsProfilePayload>,
    res: Response
  ) => {
    try {
      const flag = await businessProfileService.checkProfileLink(
        snsProfileLink
      )
      if (flag)
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
        })
      else {
        const updateSnsProfile = await snsProfileService.updateSnsProfileLink(
          user.id,
          snsProfileLink
        )
        await userService.updateSnsProfileLink(user.id, {snsProfileLink});
        
        return res.status(StatusCodes.OK).json({
          data: updateSnsProfile,
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
  }
}
