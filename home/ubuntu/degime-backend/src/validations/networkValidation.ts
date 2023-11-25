import { NextFunction, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  AddConnectorPayload,
  RemoveConnectorPayload
} from '@/contracts/network'

export const networkValidation = {
  connect: (
    req: IBodyRequest<AddConnectorPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.connector) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Connector is required',
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
  remove: (
    req: IBodyRequest<RemoveConnectorPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.connector) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Connector is required',
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
