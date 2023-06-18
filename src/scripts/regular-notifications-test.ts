// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/regular-notifications-test.ts

import { initFirebase } from "@/services/firebase";
import { sendNotificationToUser } from "@/services/notification";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  console.log(`regular-notificationts-test.ts ....`);
  await initFirebase();
  await sendNotificationToUser({
    recipientUserID: "ZqpXtiCDOyXFIEmb2N49ft5RuNi1" as UserID,
    notification: {
      data: {
        title: "Hello World",
        body: "Lorem ipsum solar descartes",
        route: "/app/profile/style",
      },
    },
    shouldPush: false,
    metadataNote: "Test notification from backend script",
  });
};
run();
