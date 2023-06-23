// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/push-notification-test.ts
import dotenv from "dotenv";
dotenv.config();
import { app, initFirebase } from "@/services/firebase";
import {
  sendPushNotification,
  sendPushNotificationToUserDevices,
} from "@/services/push";
import { PushTokenID, UserID } from "@milkshakechat/helpers";

const run = async () => {
  console.log(`push-notification-test.ts ....`);
  await initFirebase();
  await sendPushNotificationToUserDevices({
    userID: "m2fb0WWHOBesIAsevvCeNfv1w2Z2" as UserID,
    notification: {
      data: {
        title: "Hello World",
        body: "Lorem ipsum solar descartes",
        route: "/app/profile/style",
      },
    },
  });
};
run();
