import {
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import {
  ISavedProfilePayload,
  savedProfilesPayload
} from '@/contracts/savedProfiles'
import { savedProfilesService } from '@/services/savedProfilesService'
import { NextFunction, Response } from 'express-serve-static-core'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

export const savedProfilesController = {
  saveProfile: async (
    {
      context: { user },
      body
    }: ICombinedRequest<IUserRequest, savedProfilesPayload>,
    res: Response,
    next: NextFunction,
    ioFn: (data: ISavedProfilePayload) => void
  ) => {
    try {
      const response = await savedProfilesService.saveProfile(user.id, body)
      ioFn({ from_name: user.name || '', from_id: user.userId, to: response.profileOwner || '', profile_type: body.profileType || '' })
      return res.status(StatusCodes.OK).json({
        message: 'Profile saved successfully',
        status: StatusCodes.OK,
        data: { from: user.id, to: response.profileOwner || '' }
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getSavedProfiles: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const profiles = await savedProfilesService.getByUserId(user.id)
      return res.status(StatusCodes.OK).json({
        message: 'OK',
        status: StatusCodes.OK,
        data: profiles
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getSavedPublicProfiles: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const { savedBusinessProfiles, savedSnsProfiles } =
        await savedProfilesService.getSavedPublicProfiles(user.id)
      return res.status(StatusCodes.OK).json({
        message: 'OK',
        status: StatusCodes.OK,
        data: {
          savedBusinessProfiles: savedBusinessProfiles,
          savedSnsProfiles: savedSnsProfiles
        }
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getSavedPrivateProfiles: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const { savedBusinessProfiles, savedSnsProfiles } =
        await savedProfilesService.getSavedPrivateProfiles(user.id)
      return res.status(StatusCodes.OK).json({
        message: 'OK',
        status: StatusCodes.OK,
        data: {
          savedBusinessProfiles: savedBusinessProfiles,
          savedSnsProfiles: savedSnsProfiles
        }
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
