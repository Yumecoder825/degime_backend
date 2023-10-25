import { NextFunction, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  AddToCartPayload,
  RemoveItemFromCartPayload,
  UpdateToCartPayload
} from '@/contracts/cart'

export const cartValidation = {
  add2Cart: (
    req: IBodyRequest<AddToCartPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.item) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Item is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      if(!req.body.item.productId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'item.productId is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      if(!req.body.item.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'item.quantity is required',
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
  update2Cart: (
    req: IBodyRequest<UpdateToCartPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.productId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'productId is required',
          status: StatusCodes.BAD_REQUEST
        })
      }
      if (!req.body.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Quantity is required',
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
  removeItem: (
    req: IBodyRequest<RemoveItemFromCartPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.productId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'ProductId is required',
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
