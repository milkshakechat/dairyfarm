// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/extend-sendbird.ts

import { extendChatPrivileges } from "@/services/chat";
import { initFirebase } from "@/services/firebase";
import { deleteSendbirdUser } from "@/services/sendbird";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  const targetUserID = "UYJide22nAeNmj7xZhNlR0M24Kn2" as UserID;
  await initFirebase();
  // await deleteSendbirdUser({
  //   userID: targetUserID,
  // });
  await extendChatPrivileges({
    userID: targetUserID,
  });
};
run();
