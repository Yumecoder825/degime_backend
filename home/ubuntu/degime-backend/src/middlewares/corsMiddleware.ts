import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

// export const corsMiddleware = cors({
//   // origin: process.env.CLIENT_URL,
//   origin: '*',
//   optionsSuccessStatus: StatusCodes.OK
// })

export const corsMiddleware = cors()