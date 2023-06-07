// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/sendbird-sandbox.ts

import {
  // acceptGroupChannelInvite,
  createGroupChannel,
  createSendbirdUser,
  issueSessonToken,
  listSendbirdUsers,
} from "@/services/sendbird";
import { UserID } from "@milkshakechat/helpers";

const run = async () => {
  const userA = "a7debe14-5d1b-4345-b5bd-f9ecc46af243" as UserID;
  const userB = "89eeb6f9-2d01-4fb7-a544-d4e64a26d10b" as UserID;
  const userC = "the-other-guy-in-friendzone" as UserID;
  // const accessToken = "75f8017889544b7f3d6101f6141a7e7bc42ec665"
  // listSendbirdUsers();
  // createSendbirdUser({
  //   userID,
  // });
  // issueSessonToken({ userID });
  await createGroupChannel({
    participants: [userA, userC],
  });
  // accept invite
  // const userID = "the-other-guy-in-friendzone" as UserID;
  // const channelUrl =
  //   "sendbird_group_channel_187578867_05b8d3aac665c510781da5fac95c324fc00f336a";
  // await acceptGroupChannelInvite({ userID, channelUrl });
};
run();
