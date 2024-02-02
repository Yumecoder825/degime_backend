import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IUserRequest } from '@/contracts/request'
import { AddUser2ChannelPayload, CreateMessageChannelPayload, UpdateMessageChannelPayload } from '@/contracts/messageChannel'
import { messageChannelService } from '@/services'

export const messageChannelController = {
    createChannel: async (
        {
            context: { user },
            body: { ...params }
        }: ICombinedRequest<IUserRequest, CreateMessageChannelPayload>,
        res: Response
    ) => {
        try {
            const doc = await messageChannelService.getByTitle(params.title);
            if (doc) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "A duplicate channel already exists.",
                    status: StatusCodes.BAD_REQUEST
                })
            }

            await messageChannelService.create({ ...params }, user.id)

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
    },
    updateChannel: async (
        {
            context: { user },
            body: { id, ...params }
        }: ICombinedRequest<IUserRequest, UpdateMessageChannelPayload>,
        res: Response
    ) => {
        try {
            const doc = await messageChannelService.getOwnedById(id, user.id);
            if (!doc) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: `Message channel ${ReasonPhrases.NOT_FOUND}`,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            if (params.title) {
                const doc = await messageChannelService.getByTitle(params.title);
                if (doc) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: `A same channel with this title already exists.`,
                        status: StatusCodes.BAD_REQUEST
                    })
                }
            }

            await messageChannelService.updateOne(id, { ...params })

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
    },
    getJoinedChannels: async (
        {
            context: { user },
        }: ICombinedRequest<IUserRequest, undefined>,
        res: Response
    ) => {
        try {
            const channels = await messageChannelService.getJoinedChannels(user.id)

            return res.status(StatusCodes.OK).json({
                data: channels,
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
    addUser: async (
        {
            context: { user },
            body: { userId, channelId }
        }: ICombinedRequest<IUserRequest, AddUser2ChannelPayload>,
        res: Response
    ) => {
        try {
            const channel = await messageChannelService.getByUser(user.id, channelId);
            if (!channel) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            const index = channel.members.findIndex(m => m == userId)
            if (index > -1) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Already joined',
                    status: StatusCodes.BAD_REQUEST
                })
            }
            channel.members.push(userId);
            await channel.save();

            return res.status(StatusCodes.OK).json({
                data: channel,
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
    removeUser: async (
        {
            context: { user },
            body: { userId, channelId }
        }: ICombinedRequest<IUserRequest, AddUser2ChannelPayload>,
        res: Response
    ) => {
        try {
            const channel = await messageChannelService.getByUser(user.id, channelId);
            if (!channel) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                    status: StatusCodes.BAD_REQUEST
                })
            }
            const index = channel.members.findIndex(m => m == userId)
            if (index == -1) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Not memeber',
                    status: StatusCodes.NOT_FOUND
                })
            }
            const pre = channel.members.slice(0, index)
            const sub = channel.members.slice(index, channel.members.length)

            channel.members = [
                ...pre,
                ...sub
            ]
            await channel.save()
            return res.status(StatusCodes.OK).json({
                data: channel,
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
