import { Router } from 'express'

import { authGuard } from '@/guards'
import { snsProfileController } from '@/controllers'

export const snsProfiles = (router: Router): void => {
    router.post(
        '/sns-profile',
        authGuard.isAuth,
        snsProfileController.updateSNSProfile
    )
}
