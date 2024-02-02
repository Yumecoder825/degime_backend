import { Router } from 'express'

import { authGuard } from '@/guards'
import { businessProfileController } from '@/controllers'
import { withIOFn } from '@/utils/mvc'
import { Server } from 'socket.io';

export const businessProfiles = (router: Router, io: Server): void => {
    router.post(
        '/bp/create-or-update',
        authGuard.isAuth,
        withIOFn(businessProfileController.createOrUpdateBusinessProfile, (data) => {
          console.log(data);
          io.emit(`profile-changed/changed`, data);
      }
    )),
    router.get(
        '/bp/get-business-profile/:profileLink',
        businessProfileController.getBusinessProfile
    )

    router.get(
        '/bp/get-own-business-profile',
        authGuard.isAuth,
        businessProfileController.getOwnBusinessProfile
    )

    router.post(
        '/bp/update-business-link',
        authGuard.isAuth,
        businessProfileController.updateBusinessProfileLink
    )
}
