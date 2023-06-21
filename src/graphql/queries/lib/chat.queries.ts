import { authGuardHTTP } from "@/graphql/authGuard";
import {
  DemoQueryResponse,
  EnterChatRoomResponse,
  EnterChatRoomResponseSuccess,
  QueryDemoQueryArgs,
  QueryEnterChatRoomArgs,
} from "@/graphql/types/resolvers-types";
import { enterChatRoom as retrieveChatRoom } from "@/services/chat";
import { sendPushNotification } from "@/services/push";
import {
  ChatRoomID,
  ChatRoomParticipantStatus,
  UserID,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const enterChatRoom = async (
  _parent: any,
  args: QueryEnterChatRoomArgs,
  _context: any,
  _info: any
): Promise<EnterChatRoomResponseSuccess> => {
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
    chatRoom: {
      chatRoomID: chatRoom.id,
      participants: Object.keys(chatRoom.participants),
      sendBirdParticipants: Object.keys(chatRoom.participants).filter(
        (userID) =>
          chatRoom.participants[userID as UserID] ===
          ChatRoomParticipantStatus.SENDBIRD_ALLOWED
      ),
      sendBirdChannelURL: chatRoom.sendBirdChannelURL,
    },
  };
};

export const responses = {
  EnterChatRoomResponse: {
    __resolveType(
      obj: EnterChatRoomResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("chatRoom" in obj) {
        return "EnterChatRoomResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
