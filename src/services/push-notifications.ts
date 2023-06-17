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
  updateFirestoreDoc,
} from "@/services/firestore";

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
  userID: UserID;
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
