import { Request } from 'express'
const path = require('path')
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

const storage = multer.diskStorage({
  destination: joinRelativeToMainPath(process.env.STORAGE_PATH),
  filename: (_, file, cb) => {
    // Generate a unique name using a timestamp, random string, and the file's extension
    const uniqueFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}${path.extname(file.originalname)}`
    cb(null, uniqueFileName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: mbToBytes(ImageSizeInMb.Fifty) },
  fileFilter
})

export const uploadSingleFile = upload.single('file')
