import { Schema, model } from 'mongoose'
// import { INetwork, INetworkMethods, NetworkModel } from '@/contracts/network'
import { INotification, INotificationMethods, NotificationModel } from '@/contracts/notification'

const schema = new Schema<INotification, INotificationMethods, NotificationModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        notifications: [Object],
    },
    { timestamps: true }
)

export const Notification = model<INotification, NotificationModel>('Notification', schema)
