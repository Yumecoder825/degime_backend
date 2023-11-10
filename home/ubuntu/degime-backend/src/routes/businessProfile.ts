import { Router } from 'express'

import { authGuard } from '@/guards'
import { businessProfileController } from '@/controllers'

export const businessProfiles = (router: Router): void => {
    router.post(
        '/business-profile',
        authGuard.isAuth,
        businessProfileController.createBusinessProfile
    ),
    router.get(
        '/get-business-profile/:businessProfileLink',
        businessProfileController.getBusinessProfile
    )

    router.get(
        '/get-business-profiles',
        authGuard.isAuth,
        businessProfileController.getBusinessProfiles
    )
}
