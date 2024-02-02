import { Router } from 'express'

import { authGuard } from '@/guards'
import { savedProfilesController } from '@/controllers/savedProfilesController';
import { withIOFn } from '@/utils/mvc';
import { Server } from 'socket.io';

export const savedProfiles = (router: Router, io: Server): void => {
    router.post(
        '/sp/save-profile',
        authGuard.isAuth,
        withIOFn(savedProfilesController.saveProfile, (data) => {
          io.emit(`saved-profiles/${data.to}/saved`, data);
      })
        
    );

    router.get(
      '/sp/get-saved-profiles',
      authGuard.isAuth,
      savedProfilesController.getSavedProfiles
    )

    router.get(
      '/sp/get-saved-public-profiles',
      authGuard.isAuth,
      savedProfilesController.getSavedPublicProfiles
    )

    router.get(
      '/sp/get-saved-private-profiles',
      authGuard.isAuth,
      savedProfilesController.getSavedPrivateProfiles
    )
}
