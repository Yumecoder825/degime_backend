import { notificationPayload } from "@/contracts/notification";
import { Notification } from "@/models/notification";
import { ObjectId } from "mongoose";

class NotificationService {

  create(userId: ObjectId, notification?: notificationPayload) {
    const notifications: notificationPayload[] = []
    if (notification) {
      notifications.push(notification)
    }
    return new Notification({
      user: userId,
      notifications: notifications
    }).save()
  }

  async getByUserId (userId: ObjectId) {
    let notification = await Notification.findOne({ user: userId });
    if(!notification)
      notification = await this.create(userId);
    return notification;
  }

  async addNotification (userId: ObjectId, notification: notificationPayload) {
    const userNotification = await this.getByUserId(userId);
    userNotification.notifications.push(notification);
    await userNotification.save()
    return userNotification
  }
}

export const notificationService = new NotificationService;