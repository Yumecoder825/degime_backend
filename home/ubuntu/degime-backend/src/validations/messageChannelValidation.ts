import { NextFunction, Response } from 'express'
import { ObjectId } from 'mongoose'
import validator from 'validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  CreateMessageChannelPayload, UpdateMessageChannelPayload
} from '@/contracts/messageChannel'

export const messageChannelValidation = {
  createChannel: (
    req: IBodyRequest<CreateMessageChannelPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.title) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Title is required',
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
  updateChannel: (
    req: IBodyRequest<UpdateMessageChannelPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Channel id is required',
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
