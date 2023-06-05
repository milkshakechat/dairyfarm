// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/sendbird-sandbox.ts

import {
  createSendbirdUser,
  issueSessonToken,
  listSendbirdUsers,
} from "@/services/sendbird";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  const userID = "a7debe14-5d1b-4345-b5bd-f9ecc46af243" as UserID;
  // const accessToken = "75f8017889544b7f3d6101f6141a7e7bc42ec665"
  // listSendbirdUsers();
  // createSendbirdUser({
  //   userID,
  // });
  issueSessonToken({ userID });
};
run();
