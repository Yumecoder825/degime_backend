import express, { Express } from 'express'
import { Server } from 'socket.io'
import { join } from 'path'
import 'dotenv/config'

import '@/infrastructure/logger'
import { mongoose } from '@/dataSources'
import {
  corsMiddleware,
  authMiddleware,
  notFoundMiddleware
} from '@/middlewares'
import { appRouter } from '@/routes'
import { i18next, i18nextHttpMiddleware } from '@/i18n'
import { socketIoAuthMiddleware } from './middlewares/authMiddleware'

mongoose.run()

const app: Express = express()

app.use(
  '/' + process.env.STORAGE_PATH,
  express.static(join(__dirname, process.env.STORAGE_PATH))
)

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server running at1 ${process.env.APP_PORT}`)
  console.log(`Socket.io Server running at1 ${process.env.APP_SOCKET_PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
io.use(socketIoAuthMiddleware);
io.on('connection', (socket) => {
});

io.listen(process.env.APP_SOCKET_PORT)
app.use(
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  authMiddleware
)

app.use('/api', appRouter(io));
app.use(notFoundMiddleware)