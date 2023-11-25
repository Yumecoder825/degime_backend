import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IContextRequest, IParamsRequest, IUserRequest } from '@/contracts/request'
import { productsService } from '@/services'

export const productsController = {
  getProducts: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const products = await productsService.getProducts()
      if (products !== null)
        return res.status(StatusCodes.OK).json({
          data: products,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      else
        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  getProduct: async (
    { params: { productId } }: any,
    res: Response
  ) => {
    console.log("test=====");
    try {
      const product = await productsService.getProduct(productId)
      if (product !== null)
        return res.status(StatusCodes.OK).json({
          data: product,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      else
        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
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
