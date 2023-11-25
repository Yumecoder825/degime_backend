import { Router } from 'express'
import { Server } from 'socket.io'

import { authGuard } from '@/guards'
import { directMessageController } from '@/controllers'
import { directMessageValidation } from '@/validations'
import { withIOFn } from '@/utils/mvc'
import { getDirectChannelId } from '@/utils/direct-message'

export const directMessage = (router: Router, io: Server): void => {
    router.post(
        '/direct-messages',
        authGuard.isAuth,
        directMessageValidation.sendDirectMessageRequest,
        withIOFn(directMessageController.sendDirectMessage, (data) => {
            const channelId = getDirectChannelId(data.from, data.to);
            io.emit(`direct-messages/${channelId}/new`, data);
        })
    );
    router.get(
        '/direct-messages',
        authGuard.isAuth,
        directMessageController.getDirectMessages
    );
    router.post(
        '/direct-messages/update',
        authGuard.isAuth,
        withIOFn(directMessageController.update, (data) => {
            const channelId = getDirectChannelId(data.from, data.to);
            io.emit(`direct-messages/${channelId}/new`, data);
        })
    );
    router.post(
        '/direct-messages/remove',
        authGuard.isAuth,
        withIOFn(directMessageController.remove, (data) => {
            const channelId = getDirectChannelId(data.from, data.to);
            io.emit(`direct-messages/${channelId}/new`, data);
        })
    );
}
