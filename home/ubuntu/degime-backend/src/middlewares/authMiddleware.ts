import { NextFunction, Request, Response } from 'express'

import { getAccessTokenFromHeaders } from '@/utils/headers'
import { jwtVerify } from '@/utils/jwt'
import { userService } from '@/services'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Object.assign(req, { context: {} })

    const { accessToken } = getAccessTokenFromHeaders(req.headers)
    if (!accessToken) return next()

    const { id } = jwtVerify({ accessToken })
    if (!id) return next()

    const user = await userService.getById(id)
    if (!user) return next()

    Object.assign(req, {
      context: {
        user,
        accessToken
      }
    })

    return next()
  } catch (error) {
    return next()
  }
}

export const socketIoAuthMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const accessToken = socket.handshake.auth.token
    // if (!accessToken) return next()

    // const { id } = jwtVerify({ accessToken })
    // if (!id) return next()

    // const user = await userService.getById(id)
    // if (!user) return next()
    // Object.assign(socket, {
    //   context: {
    //     user,
    //     accessToken
    //   }
    // })
    return next()
  } catch (error) {
    socket.disconnect();
    return next(new Error('Authentication error'))
  }
}
