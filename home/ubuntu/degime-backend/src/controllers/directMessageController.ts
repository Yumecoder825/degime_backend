import { NextFunction, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IUserRequest } from '@/contracts/request'
import { directMessageService } from '@/services'
import { GetDirectMessagePayload, IDirectMessagePayload, RemoveDirectMessagePayload, SendDirectMessagePayload, UpdateDirectMessagePayload } from '@/contracts/directMessage'

export const directMessageController = {
    sendDirectMessage: async (
        {
            context: { user },
            body: { to, message, file }
        }: ICombinedRequest<IUserRequest, SendDirectMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IDirectMessagePayload) => void
    ) => {
        try {
            const msg = await directMessageService.create(user.id, to, message, file)
            ioFn(msg.toJSON())
            return res.status(StatusCodes.OK).json({
                data: { from: user.id, to: to, message: message },
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
    getDirectMessages: async (
        {
            context: { user },
            query: { from, to, cursor, limit },
        }: ICombinedRequest<IUserRequest, undefined, undefined, GetDirectMessagePayload>,
        res: Response
    ) => {
        try {

            if (!([from, to].includes(user.id))) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "You can't get this history.",
                    status: StatusCodes.BAD_REQUEST
                })
            }
            if (!limit) limit = '10';

            const result = await directMessageService.getMessages(+limit, from, to, cursor)

            return res.status(StatusCodes.OK).json({
                data: result,
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
    update: async (
        {
            context: { user },
            body: { id, message },
        }: ICombinedRequest<IUserRequest, UpdateDirectMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IDirectMessagePayload) => void
    ) => {
        try {
            const existingMsg = await directMessageService.getById(id);
            if (!existingMsg) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'No message with ' + id,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            if (existingMsg.from != user.id) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'You are not the owner.',
                    status: StatusCodes.BAD_REQUEST
                })
            }
            existingMsg.message = message;
            existingMsg.save()

            ioFn(existingMsg.toJSON())

            return res.status(StatusCodes.OK).json({
                data: { message: message, id: id },
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
    remove: async (
        {
            context: { user },
            body: { id },
        }: ICombinedRequest<IUserRequest, RemoveDirectMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IDirectMessagePayload) => void
    ) => {
        try {
            const existingMsg = await directMessageService.getById(id);
            if (!existingMsg) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'No message with ' + id,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            if (user.id != existingMsg.from) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'You are not the owner.',
                    status: StatusCodes.BAD_REQUEST
                })
            }
            ioFn(existingMsg.toJSON())
            await existingMsg.delete();

            return res.status(StatusCodes.OK).json({
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
