import { Router } from 'express'

import { networkController } from '@/controllers'
import { authGuard } from '@/guards'
import { networkValidation } from '@/validations'

export const network = (router: Router): void => {
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
        '/network',
        authGuard.isAuth,
        networkValidation.connect,
        networkController.connect
    );
    router.post(
        '/network/remove',
        authGuard.isAuth,
        networkValidation.remove,
        networkController.removeConnector
    );
}
