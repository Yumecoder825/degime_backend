import { notificationController } from '@/controllers'
import { authGuard } from '@/guards'
import { Router } from 'express'

export const notification = (router: Router): void => {
  router.get(
    '/nt/get-notifications',
    authGuard.isAuth,
    notificationController.getNotifications
  ),
  router.post(
    '/nt/add-notification',
    authGuard.isAuth,
    notificationController.addNotification
  )
}
