import { Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { ICombinedRequest, IContextRequest, IUserRequest } from '@/contracts/request'
import { cartService } from '@/services'
import { AddToCartPayload, RemoveItemFromCartPayload, UpdateToCartPayload } from '@/contracts/cart'

export const cartController = {
    addToCart: async (
        {
            context: { user },
            body: { ...values }
        }: ICombinedRequest<IUserRequest, AddToCartPayload>,
        res: Response
    ) => {
        try {
            const item = await cartService.addItemToCart(user.id, values.item)

            return res.status(StatusCodes.OK).json({
                data: item,
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
    removeFromCart: async (
        {
            context: { user },
            body: { productId }
        }: ICombinedRequest<IUserRequest, RemoveItemFromCartPayload>,
        res: Response
    ) => {
        try {
            const item = await cartService.removeItemFromCart(user.id, productId)

            return res.status(StatusCodes.OK).json({
                data: item,
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
    updateItemFromCart: async (
        {
            context: { user },
            body: { productId, quantity }
        }: ICombinedRequest<IUserRequest, UpdateToCartPayload>,
        res: Response
    ) => {
        try {
            const item = await cartService.updateItem(user.id, productId, quantity)

            return res.status(StatusCodes.ACCEPTED).json({
                data: item,
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
    getMyCart: async (
        {
            context: { user },
        }: IContextRequest<IUserRequest>,
        res: Response
    ) => {
        try {
            const cart = await cartService.getByUserId(user.id);
            if (!cart) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: ReasonPhrases.NOT_FOUND,
                    status: StatusCodes.NOT_FOUND
                })
            }
            return res.status(StatusCodes.OK).json({
                data: cart,
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
