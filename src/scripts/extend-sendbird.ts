// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/extend-sendbird.ts

import { extendChatPrivileges } from "@/services/chat";
import { initFirebase } from "@/services/firebase";
import { deleteSendbirdUser } from "@/services/sendbird";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  const targetUserID = "V968yxHwkoc2eCQwnhV1WN5jWRy1" as UserID;
  await initFirebase();
  // await deleteSendbirdUser({
  //   userID: targetUserID,
  // });
  await extendChatPrivileges({
    userID: targetUserID,
  });
};
run();