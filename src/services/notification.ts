import {
  FirestoreCollection,
  NotificationID,
  Notification_Firestore,
  PushMessageRecieptID,
  PushNotificationShape,
  UserID,
} from "@milkshakechat/helpers";
import { sendPushNotificationToUserDevices } from "@/services/push";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
} from "@/services/firestore";
import { v4 as uuidv4 } from "uuid";

interface SendNotificationToUserProps {
  recipientUserID: UserID;
  shouldPush: boolean;
  notification: PushNotificationShape;
  metadataNote: string;
}
export const sendNotificationToUser = async ({
  recipientUserID,
  shouldPush,
  notification,
  metadataNote,
}: SendNotificationToUserProps) => {
  let pushReciepts: PushMessageRecieptID[] = [];
  // handle fcm push first
  if (shouldPush) {
    pushReciepts = await sendPushNotificationToUserDevices({
      userID: recipientUserID,
      notification,
    });
  }
  const notifID = uuidv4() as NotificationID;
  const notif: Notification_Firestore = {
    id: notifID,
    recipientID: recipientUserID,
    title: notification.data.title,
    body: notification.data.body,
    image: notification.data.image,
    route: notification.data.route,
    metadataNote,
    createdAt: createFirestoreTimestamp(),
    markedRead: false,
  };
  if (pushReciepts && pushReciepts.length > 0) {
    notif.pushMessageRecieptIDs = pushReciepts;
  }
  // save notification to firestore
  console.log(`Saving notification to firestore...`);
  await createFirestoreDoc<NotificationID, Notification_Firestore>({
    id: notifID,
    data: notif,
    collection: FirestoreCollection.NOTIFICATIONS,
  });
  // publish to websocket subscription for clients
  console.log(`TODO: Publishing notification to websocket subscription...`);
};
