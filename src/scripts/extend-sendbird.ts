// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/extend-sendbird.ts

import { extendChatPrivileges } from "@/services/chat";
import { initFirebase } from "@/services/firebase";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  const targetUserID = "VUac5PRSdxZmpSwBYRsAZOEyvhk2" as UserID;
  await initFirebase();
  await extendChatPrivileges({
    userID: targetUserID,
  });
};
run();
