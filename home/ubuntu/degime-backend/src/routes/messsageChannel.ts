import { Router } from 'express'

import { messageChannelController } from '@/controllers'
import { authGuard } from '@/guards'
import { messageChannelValidation } from '@/validations'
import { Server } from 'socket.io'

export const messageChannel = (router: Router, io: Server): void => {
  router.post(
    '/message-channel',
    authGuard.isAuth,
    messageChannelValidation.createChannel,
    messageChannelController.createChannel
  );
  router.post(
    '/message-channel/update',
    authGuard.isAuth,
    messageChannelValidation.updateChannel,
    messageChannelController.updateChannel
  );
  router.get(
    '/message-channel/joined-channels',
    authGuard.isAuth,
    messageChannelController.getJoinedChannels
  );
}
