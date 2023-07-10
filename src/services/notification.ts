import {
  FirestoreCollection,
  NotificationID,
  Notification_Firestore,
  PushMessageRecieptID,
  PushNotificationShape,
  UserID,
  User_Firestore,
  Username,
  localeEnum,
} from "@milkshakechat/helpers";
import { sendPushNotificationToUserDevices } from "@/services/push";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  updateFirestoreDoc,
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

export const notifySentFriendRequest = async ({
  recipientUserID,
  senderUserID,
}: {
  recipientUserID: UserID;
  senderUserID: UserID;
}) => {
  const sender = await getFirestoreDoc<UserID, User_Firestore>({
    collection: FirestoreCollection.USERS,
    id: senderUserID,
  });
  const { language } = sender;
  const res = await sendNotificationToUser({
    recipientUserID,
    notification: {
      data: {
        title: `@${sender.username} sent a friend request`,
        body: "Would you like to accept?",
        route: `/app/friends?tab=requests&user=${senderUserID}`,
        image: sender.avatar,
        icon: sender.avatar,
      },
    },
    shouldPush: true,
    metadataNote: `Sender=${senderUserID} requested friendship with Recipient=${recipientUserID} on ${new Date().toISOString()}`,
  });
  return res;
};

export const notifyAcceptFriendRequest = async ({
  recipientUserID,
  senderUserID,
}: {
  recipientUserID: UserID;
  senderUserID: UserID;
}) => {
  const [recipient, sender] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      collection: FirestoreCollection.USERS,
      id: recipientUserID,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      collection: FirestoreCollection.USERS,
      id: senderUserID,
    }),
  ]);
  const { language } = recipient;
  const res = await sendNotificationToUser({
    recipientUserID,
    notification: {
      data: {
        title: `@${sender.username} accepted friend request`,
        body: "Send them a welcome message!",
        route: `/user?user=${sender.id}`,
        image: sender.avatar,
        icon: sender.avatar,
      },
    },
    shouldPush: true,
    metadataNote: `Recipient=${recipientUserID} accepted friendship from Sender=${senderUserID} on ${new Date().toISOString()}`,
  });
  return res;
};

export const markNotifications = async ({
  markedRead,
  notificationIDs,
}: {
  markedRead: boolean;
  notificationIDs: NotificationID[];
}) => {
  const notifs = await Promise.all(
    notificationIDs.map(async (nid) => {
      const notif = updateFirestoreDoc<NotificationID, Notification_Firestore>({
        id: nid,
        payload: {
          markedRead,
        },
        collection: FirestoreCollection.NOTIFICATIONS,
      });
      return notif;
    })
  );
  return notifs;
};
