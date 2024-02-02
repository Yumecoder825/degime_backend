import { Router } from 'express'

import { authGuard } from '@/guards'
import { mediaController } from '@/controllers'
import { uploadSingleFileMiddleware } from '@/middlewares'

export const media = (router: Router): void => {
  router.post(
    '/media/image/upload',
    uploadSingleFileMiddleware,
    mediaController.imageUpload
  ),

  router.post(
    '/media/file/upload',
    uploadSingleFileMiddleware,
    mediaController.fileUpload
  )
}
