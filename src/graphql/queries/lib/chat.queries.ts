import { authGuardHTTP } from "@/graphql/authGuard";
import {
  DemoQueryResponse,
  EnterChatRoomResponse,
  QueryDemoQueryArgs,
  QueryEnterChatRoomArgs,
} from "@/graphql/types/resolvers-types";
import { enterChatRoom as retrieveChatRoom } from "@/services/chat";
import { sendPushNotification } from "@/services/push";
import { ChatRoomID, UserID } from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const enterChatRoom = async (
  _parent: any,
  args: QueryEnterChatRoomArgs,
  _context: any,
  _info: any
) => {
  console.log(`enterChatRoom()...`);
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("Your UserID not found");
  }
  console.log(`Entering chat room...`);

  const chatRoom = await retrieveChatRoom({
    userID: userID,
    chatRoomID: (args.input.chatRoomID as ChatRoomID) || undefined,
    participants: (args.input.participants as UserID[]) || undefined,
  });
  return {
    chatRoomID: chatRoom.id,
    participants: chatRoom.participants,
    sendBirdChannelURL: chatRoom.sendBirdChannelURL,
    hasSendBirdPriviledge: chatRoom.sendBirdParticipants.includes(userID),
  };
};

export const responses = {
  EnterChatRoomResponse: {
    __resolveType(
      obj: EnterChatRoomResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("message" in obj) {
        return "DemoQueryResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
