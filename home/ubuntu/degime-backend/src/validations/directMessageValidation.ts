import { NextFunction, Response } from 'express'
import { ObjectId } from 'mongoose'
import validator from 'validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  SendDirectMessagePayload
} from '@/contracts/directMessage'

export const directMessageValidation = {
  sendDirectMessageRequest: (
    req: IBodyRequest<SendDirectMessagePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.to) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }
      if (!req.body.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
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
}
