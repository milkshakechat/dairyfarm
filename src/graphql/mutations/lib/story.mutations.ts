import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CreateStoryResponse,
  MutationCreateStoryArgs,
  Story,
  StoryAttachmentType,
} from "@/graphql/types/resolvers-types";
import { decodeFirestoreTimestamp } from "@/services/firestore";
import { convertStoryToGraphQL, createStoryFirestore } from "@/services/story";
import { GraphQLResolveInfo } from "graphql";

export const createStory = async (
  _parent: any,
  args: MutationCreateStoryArgs,
  _context: any,
  _info: any
): Promise<{
  story: Partial<Story>;
}> => {
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
    // @ts-ignore
    story: convertStoryToGraphQL(story),
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
