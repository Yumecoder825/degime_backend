import { Model, ObjectId } from 'mongoose'

export type NotificationProps = {
  from?: string,
  message?: string,
  type?: string,
  other?: string,
  isRead?: boolean,
  timestamp?: number,
}

export interface INotification {
  user: ObjectId,
  notifications: NotificationProps[]
}

export interface INotificationMethods {
}

export type notificationPayload = Partial<NotificationProps>


export type NotificationModel = Model<INotification, unknown, INotificationMethods>
