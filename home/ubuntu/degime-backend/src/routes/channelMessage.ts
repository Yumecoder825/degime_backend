import { Router } from 'express'
import { Server } from 'socket.io'

import { channelMessageController } from '@/controllers'
import { authGuard } from '@/guards'
import { channelMsgValidation } from '@/validations'
import { withIOFn } from '@/utils/mvc'

export const channelMessage = (router: Router, io: Server): void => {
  router.get(
    '/messages',
    authGuard.isAuth,
    channelMessageController.getMessages
  );
  router.post(
    '/messages',
    authGuard.isAuth,
    channelMsgValidation.sendMessage,
    withIOFn(channelMessageController.sendMessage, (data) => {
      io.emit(`message-channel/${data.messageChannel}/new`, data);
    })
  );
  router.post(
    '/messages/update',
    authGuard.isAuth,
    channelMsgValidation.updateMessage,
    withIOFn(channelMessageController.updateMessage, (data) => {
      io.emit(`message-channel/${data.messageChannel}/updated`, data);
    })
  );
  router.post(
    '/messages/remove',
    authGuard.isAuth,
    channelMsgValidation.removeMessage,
    withIOFn(channelMessageController.removeMsg, (data) => {
      io.emit(`message-channel/${data.messageChannel}/removed`, data);
    })
  );
}
