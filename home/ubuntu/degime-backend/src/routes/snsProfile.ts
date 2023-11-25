import { Router } from 'express'

import { authGuard } from '@/guards'
import { snsProfileController } from '@/controllers'

export const snsProfiles = (router: Router): void => {
    router.post(
        '/sp/create-or-update',
        authGuard.isAuth,
        snsProfileController.createOrUpdateSNSProfile
    )
    
    router.get(
        '/bp/get-sns-profile/:profileLink',
        snsProfileController.getSNSProfile
    )

    router.get(
        '/sp/get-own-sns-profile',
        authGuard.isAuth,
        snsProfileController.getOwnSNSProfile
    )

    router.post(
        '/sp/update-sns-link',
        authGuard.isAuth,
        snsProfileController.updateSNSProfileLink
    )
}
