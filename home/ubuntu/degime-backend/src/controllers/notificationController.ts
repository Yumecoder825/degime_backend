import { notificationPayload } from '@/contracts/notification'
import {
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { notificationService } from '@/services'
import { Response } from 'express-serve-static-core'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

export const notificationController = {
  addNotification: async (
    {
      context: { user },
      body
    }: ICombinedRequest<IUserRequest, notificationPayload>,
    res: Response
  ) => {
    try {
      const response = await notificationService.addNotification(user.id, body)
      return res.status(StatusCodes.OK).json({
        message: 'New notification',
        status: StatusCodes.OK,
        data: response
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getNotifications: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const notifications = await notificationService.getByUserId(user.id)
      return res.status(StatusCodes.OK).json({
        message: 'OK',
        status: StatusCodes.OK,
        data: notifications
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
