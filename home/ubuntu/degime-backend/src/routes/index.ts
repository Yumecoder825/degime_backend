import { Router } from 'express'
import { Server } from 'socket.io'

import { auth } from './auth'
import { users } from './users'
import { media } from './media'

import { snsProfiles } from './snsProfile'
import { businessProfiles } from './businessProfile'
import { directMessage } from './directMessage'
import { channelMessage } from './channelMessage'
import { messageChannel } from './messsageChannel'
import { cart } from './cart'
import { network } from './network'
import { products  } from './products'
import { savedProfiles } from './savedProfiles'
import { notification } from './notification'

export const appRouter = (io: Server) => {
  const router: Router = Router()

  const routes: {
    [key: string]: (router: Router, io: any) => void
  } = { auth, users, media, snsProfiles, businessProfiles, directMessage, messageChannel, channelMessage, cart, network, products, savedProfiles, notification }

  for (const route in routes) {
    routes[route](router, io)
  }
  return router;
}
