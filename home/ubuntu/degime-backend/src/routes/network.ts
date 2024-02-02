import { Router } from 'express'

import { networkController } from '@/controllers'
import { authGuard } from '@/guards'
import { networkValidation } from '@/validations'
import { withIOFn } from '@/utils/mvc'
import { Server } from 'socket.io'

export const network = (router: Router, io: Server): void => {
    router.get(
        '/network/mine',
        authGuard.isAuth,
        networkController.getMyNetwork
    );
    router.get(
        '/network/:id',
        authGuard.isAuth,
        networkController.getnetworkById
    );
    router.post(
        '/network/connect',
        authGuard.isAuth,
        networkValidation.connect,
        
        withIOFn(networkController.connect, (data) => {
            console.log(data);
            io.emit(`connect-request/${data.to}`, data);
        })
    );
    router.post(
        '/network/remove',
        authGuard.isAuth,
        networkValidation.remove,
        networkController.removeConnector
    );
}
