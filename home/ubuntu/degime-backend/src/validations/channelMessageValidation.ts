import { NextFunction, Response } from 'express'
import { ObjectId } from 'mongoose'
import validator from 'validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  CreateChannelMessagePayload,
  UpdateChannelMessagePayload,
  RemoveChannelMessagePayload
} from '@/contracts/channelMessage'

export const channelMsgValidation = {
  sendMessage: (
    req: IBodyRequest<CreateChannelMessagePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.messageChannel) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Channel is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      if (!req.body.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Message is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  updateMessage: (
    req: IBodyRequest<UpdateChannelMessagePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Message id is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      if (!req.body.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'What are you trying to update?',
          status: StatusCodes.BAD_REQUEST
        })
      }
      return next()
    } catch (error) {
      winston.error(error)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  removeMessage: (
    req: IBodyRequest<RemoveChannelMessagePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Message id is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      return next()
    } catch (error) {
      winston.error(error)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
