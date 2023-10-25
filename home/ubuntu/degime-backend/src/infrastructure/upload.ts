import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { ImageSizeInMb, Mimetype } from '@/constants'
import { mbToBytes } from '@/utils/maths'
import { joinRelativeToMainPath } from '@/utils/paths'

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {

  cb(null, true)
}

const upload = multer({
  dest: joinRelativeToMainPath(process.env.STORAGE_PATH),
  limits: { fileSize: mbToBytes(ImageSizeInMb.Fifty) },
  fileFilter
})

export const uploadSingleImage = upload.single('file')
