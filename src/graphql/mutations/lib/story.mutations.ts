import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CreateStoryResponse,
  MutationCreateStoryArgs,
  StoryAttachmentType,
} from "@/graphql/types/resolvers-types";
import { decodeFirestoreTimestamp } from "@/services/firestore";
import { createStoryFirestore } from "@/services/story";
import { GraphQLResolveInfo } from "graphql";

export const createStory = async (
  _parent: any,
  args: MutationCreateStoryArgs,
  _context: any,
  _info: any
): Promise<CreateStoryResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const { caption, media } = args.input;
  const { url, type, assetID } = media || {};

  if (caption.length > 240) {
    throw Error("Caption must be less than 240 characters");
  }
  // create the story
  const story = await createStoryFirestore({
    mediaUrl: url,
    mediaType: type,
    userID,
    caption,
    assetID,
  });
  // return the story
  return {
    story: {
      id: story.id,
      userID: story.userID,
      caption: story.caption,
      attachments: story.attachments.map((att) => {
        return {
          id: att.id,
          userID: att.userID,
          type: att.type as unknown as StoryAttachmentType,
          url: att.url,
          thumbnail: att.thumbnail,
          stream: att.stream,
          altText: att.altText,
        };
      }),
      pinned: story.pinned,
      thumbnail: story.thumbnail,
      showcaseThumbnail: story.showcaseThumbnail,
      outboundLink: story.outboundLink,
      createdAt: decodeFirestoreTimestamp(story.createdAt),
      expiresAt: decodeFirestoreTimestamp(story.expiresAt),
    },
  };
};

export const responses = {
  CreateStoryResponse: {
    __resolveType(
      obj: CreateStoryResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("story" in obj) {
        return "CreateStoryResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
