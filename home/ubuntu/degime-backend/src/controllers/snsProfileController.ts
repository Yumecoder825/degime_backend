import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IUserRequest } from '@/contracts/request'
import { UpdateSNSProfilePayload } from '@/contracts/snsProfile'
import { snsProfileService } from '@/services'

export const snsProfileController = {
    updateSNSProfile: async (
        {
            context: { user },
            body: { ...params }
        }: ICombinedRequest<IUserRequest, UpdateSNSProfilePayload>,
        res: Response
    ) => {
        try {
            await snsProfileService.createOrUpdate(user.id, { ...params })

            return res.status(StatusCodes.OK).json({
                data: { ...params },
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