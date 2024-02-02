export declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number
      APP_SOCKET_PORT: number
      APP_URL: string
      SERVER_URL: string
      CLIENT_URL: string
      MONGODB_URI: string
      JWT_SECRET: string
      JWT_EXPIRATION: string
      MAIL_HOST: string
      MAIL_PORT: number
      MAIL_USER: string
      MAIL_PASSWORD: string
      MAIL_TPL_PATH: string
      STORAGE_PATH: string
    }
  }
}
