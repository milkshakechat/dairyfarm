import {
  FirestoreCollection,
  PushPlatformType,
  PushTokenID,
  PushToken_Firestore,
  UserID,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  listFirestoreDocs,
  updateFirestoreDoc,
} from "@/services/firestore";
import * as admin from "firebase-admin";
import { app, firestore, messaging } from "@/services/firebase";
import { getMessaging } from "firebase-admin/messaging";
import { getFCMServerKey } from "@/utils/secrets";
import axios from "axios";
import { Query, QueryDocumentSnapshot } from "@google-cloud/firestore";

interface SaveOrUpdatePushTokenProps {
  token: PushTokenID;
  userID: UserID;
  title?: string;
}
export const saveOrUpdatePushToken = async ({
  token,
  userID,
  title,
}: SaveOrUpdatePushTokenProps) => {
  let existingToken: PushToken_Firestore | undefined;
  try {
    existingToken = await getFirestoreDoc<PushTokenID, PushToken_Firestore>({
      id: token,
      collection: FirestoreCollection.PUSH_TOKENS,
    });
  } catch (e) {
    console.log(e);
  }
  const now = createFirestoreTimestamp();
  if (existingToken && existingToken.userID === userID) {
    // update the existing token
    await updateFirestoreDoc({
      id: existingToken.id,
      payload: {
        lastActive: now,
        active: true,
      },
      collection: FirestoreCollection.PUSH_TOKENS,
    });
    return `Successfully updated push token ${token} for user ${userID} to lastActive ${now.toDate()}`;
  } else {
    // create a new token for firebase
    await createFirestoreDoc({
      id: token,
      data: {
        id: token,
        userID: userID,
        token: token,
        pushPlatformType: PushPlatformType.firebase,
        lastActive: now,
        title: title
          ? `${title} for User ${userID}`
          : `Push Token ${token} for User ${userID}`,
        active: true,
      },
      collection: FirestoreCollection.PUSH_TOKENS,
    });
    return `Successfully created new push token ${token} for user ${userID}`;
  }
};

interface DeactivatePushTokenProps {
  token: PushTokenID;
  userID?: UserID;
}
export const deactivatePushToken = async ({
  token,
  userID,
}: DeactivatePushTokenProps) => {
  await updateFirestoreDoc({
    id: token,
    payload: {
      active: false,
    },
    collection: FirestoreCollection.PUSH_TOKENS,
  });
  return `Successfully deactivated push token ${token} for user ${userID}`;
};

const DEFAULT_PUSH_NOTIFICATION_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fmilkshake_fcm_icon.jpg?alt=media";
export type ValidClientAppRoute = string;
export interface PushNotificationShape {
  data: {
    title: string;
    body: string;
    image?: string;
    icon?: string; // icon="https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fmilkshake_fcm_icon.jpg?alt=media";
    route: ValidClientAppRoute; // eg: "/app/chats/123"";
  };
}
export interface PushNotificationPackage extends PushNotificationShape {
  to: PushTokenID;
}

export const sendPushNotification = async (
  notification: PushNotificationPackage
) => {
  try {
    const key = await getFCMServerKey();
    const res = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      notification,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${key}`,
        },
      }
    );
    if (res.data.failure) {
      console.log(`Got a failed push notification response`);
      console.log(res.data);
      const shouldDeactivateToken =
        res.data.results.some(
          (result: any) => result.error === "NotRegistered"
        ) &&
        res.data.failure === 1 &&
        res.data.success === 0;
      if (shouldDeactivateToken) {
        console.log(`Deactivating token ${notification.to}`);
        await deactivatePushToken({
          token: notification.to,
        });
        return null;
      }
    }
    if (res.data.success) {
    }
    return null;
  } catch (e) {
    console.log(e);
  }
};

const listActivePushTargets = async (
  userID: UserID
): Promise<PushToken_Firestore[]> => {
  const ref = firestore
    .collection(FirestoreCollection.PUSH_TOKENS)
    .where("userID", "==", userID)
    .where("active", "==", true) as Query<PushToken_Firestore>;
  const collectionItems = await ref.get();
  if (collectionItems.empty) {
    return [];
  } else {
    return collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<PushToken_Firestore>) => {
        const data = doc.data();
        return data;
      }
    );
  }
};

interface SendPushNotificationToUserDevicesProps {
  userID: UserID;
  notification: PushNotificationShape;
}
export const sendPushNotificationToUserDevices = async ({
  userID,
  notification,
}: SendPushNotificationToUserDevicesProps) => {
  const targets = await listActivePushTargets(userID);
  console.log(`Got ${targets.length} push targets for user ${userID}`);
  await Promise.all(
    targets.map((target) => {
      const fullPackage = {
        to: target.id,
        ...notification,
        data: {
          ...notification.data,
          icon: notification.data.icon || DEFAULT_PUSH_NOTIFICATION_IMAGE,
          tag: notification.data.route,
        },
      };
      if (notification.data.image) {
        fullPackage.data.image = notification.data.image;
      }
      return sendPushNotification(fullPackage);
    })
  );
};
