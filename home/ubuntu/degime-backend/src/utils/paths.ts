import { dirname, join } from 'path'

export const joinRelativeToMainPath = (path = '') => {
  const { filename } = require.main || {}

  if (!filename) return path

  return join(dirname(filename), path)
}

export const appUrl = (path = '') => `${process.env.SERVER_URL}/${path}`
// export const appUrl = (path = '') => `https://degime-backend.onrender.com/${path}`
