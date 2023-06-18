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
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log(
      `Using service account file: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
    );
  } else {
    console.log("Using default application credentials.");
  }
  await initFirebase();
  await sendPushNotificationToUserDevices({
    userID: "ZqpXtiCDOyXFIEmb2N49ft5RuNi1" as UserID,
    notification: {
      // notification: {
      //   title: "Hello World",
      //   body: "Lorem ipsum solar descartes",
      // },
      data: {
        title: "Hello World",
        body: "Lorem ipsum solar descartes",
        tag: "/app/profile/style",
      },
    },
  });
};
run();
