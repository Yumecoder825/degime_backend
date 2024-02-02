import { NextFunction, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IUserRequest } from '@/contracts/request'
import { messageChannelService, channelMessageService } from '@/services'

import {
    CreateChannelMessagePayload,
    GetChannelMessagePayload,
    IChannelMesssage,
    RemoveChannelMessagePayload,
    UpdateChannelMessagePayload
} from '@/contracts/channelMessage'

export const channelMessageController = {
    getMessages: async (
        {
            context: { user },
            query: { cursor, limit, messageChannel, sentBy },
        }: ICombinedRequest<IUserRequest, undefined, undefined, GetChannelMessagePayload>,
        res: Response
    ) => {
        try {
            if (!limit) limit = '10';
            const result = await channelMessageService.getMessages(messageChannel, sentBy, cursor, +limit)

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
    sendMessage: async (
        {
            body: {
                message,
                file,
                messageChannel
            },
            context: {
                user
            },
        }: ICombinedRequest<IUserRequest, CreateChannelMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IChannelMesssage) => void
    ) => {
        try {
            const joined = await messageChannelService.getByUser(user.id, messageChannel);
            if (!joined) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'No Channel or You are not the member!',
                    status: StatusCodes.NOT_FOUND
                })
            }
            const newMsg = await channelMessageService.create({
                message: message,
                messageChannel: messageChannel,
                file: file,
                sentBy: user.id
            });

            console.log(newMsg);
            // socket emit
            ioFn(newMsg)
            return res.status(StatusCodes.OK).json({
                data: newMsg,
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
    updateMessage: async (
        {
            body: {
                id,
                message,
            },
            context: {
                user
            }
        }: ICombinedRequest<IUserRequest, UpdateChannelMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IChannelMesssage) => void
    ) => {
        try {
            const msg = await channelMessageService.getById(id, user._id);
            if (!msg) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Message not found',
                    status: StatusCodes.NOT_FOUND
                })
            }
            msg.message = message;
            await msg.save()
            ioFn(msg)
            return res.status(StatusCodes.OK).json({
                data: msg,
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
    removeMsg: async (
        {
            body: {
                id,
            },
            context: {
                user
            }
        }: ICombinedRequest<IUserRequest, RemoveChannelMessagePayload>,
        res: Response,
        next: NextFunction,
        ioFn: (data: IChannelMesssage) => void
    ) => {
        try {
            const msg = await channelMessageService.getById(id, user._id);
            if (!msg) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Message not found',
                    status: StatusCodes.NOT_FOUND
                })
            }
            await channelMessageService.deleteById(id);
            ioFn(msg)
            return res.status(StatusCodes.OK).json({
                data: msg,
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