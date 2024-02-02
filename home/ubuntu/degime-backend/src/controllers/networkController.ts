import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import {
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { networkService } from '@/services'
import {
  AddConnectorPayload,
  INetworkRequestPayload,
  RemoveConnectorPayload
} from '@/contracts/network'
import { NextFunction } from 'express-serve-static-core'

export const networkController = {
  connect: async (
    {
      context: { user },
      body: { connector }
    }: ICombinedRequest<IUserRequest, AddConnectorPayload>,
    res: Response,
    next: NextFunction,
    ioFn: (data: INetworkRequestPayload) => void
  ) => {
    try {
      const network = await networkService.addConnector(user.id, connector)
      // const network1 = await networkService.addConnector(connector, user.id);
      ioFn({
        from_name: user.name || '',
        from_userId: user.userId,
        from_id: user.id,
        to: connector,
      })

      return res.status(StatusCodes.OK).json({
        data: network,
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
  removeConnector: async (
    {
      context: { user },
      body: { connector }
    }: ICombinedRequest<IUserRequest, RemoveConnectorPayload>,
    res: Response
  ) => {
    try {
      const network = await networkService.removeConnector(user.id, connector)

      return res.status(StatusCodes.OK).json({
        data: network,
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
  getMyNetwork: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const network = await networkService.getViewDataByUserId(user.id)
      return res.status(StatusCodes.OK).json({
        data: network,
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
  getnetworkById: async (
    { params: { id } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      // @ts-ignore
      const network = await networkService.getViewDataByUserId(id)
      return res.status(StatusCodes.OK).json({
        data: network,
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
