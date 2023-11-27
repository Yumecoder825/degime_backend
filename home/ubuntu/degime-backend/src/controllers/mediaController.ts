import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import { mediaService } from '@/services'
import { Image } from '@/infrastructure/image'
import { IContextRequest, IUserRequest } from '@/contracts/request'
import { appUrl, joinRelativeToMainPath } from '@/utils/paths'

export const mediaController = {
  imageUpload: async (
    { file }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const media = await mediaService.create(file as Express.Multer.File)
      const image = appUrl(
        await new Image(media).sharp({ width: 150, height: 150 })
      )
      return res.status(StatusCodes.OK).json({
        data: { id: media.id, file: image },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      await new Image(file as Express.Multer.File).deleteFile()

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  fileUpload: async (
    { file }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    const media = await mediaService.create(file as Express.Multer.File)
    return res.status(StatusCodes.OK).json({
      data: { id: media.id, file: `${process.env.SERVER_URL}/${media.path}` },
      // data: { id: media.id, file: `https://degime-backend.onrender.com/${media.path}` },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  }
}
