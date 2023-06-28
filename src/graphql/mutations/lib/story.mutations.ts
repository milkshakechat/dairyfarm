import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CreateStoryResponse,
  ModifyStoryResponse,
  MutationCreateStoryArgs,
  MutationModifyStoryArgs,
  Story,
  StoryAttachmentType,
} from "@/graphql/types/resolvers-types";
import {
  decodeFirestoreTimestamp,
  getFirestoreDoc,
  updateFirestoreDoc,
} from "@/services/firestore";
import { convertStoryToGraphQL, createStoryFirestore } from "@/services/story";
import {
  FirestoreCollection,
  StoryID,
  Story_Firestore,
} from "@milkshakechat/helpers";
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

export const modifyStory = async (
  _parent: any,
  args: MutationModifyStoryArgs,
  _context: any,
  _info: any
): Promise<{ story: Partial<Story> }> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }

  const story = await getFirestoreDoc<StoryID, Story_Firestore>({
    id: args.input.storyID as StoryID,
    collection: FirestoreCollection.STORIES,
  });

  if (story.userID !== userID) {
    throw new Error(`You do not have permission to update story ${story.id}`);
  }
  // update
  const updatePayload: Partial<Story_Firestore> = {};
  if (args.input.pinned != undefined) {
    updatePayload.pinned = args.input.pinned;
    updatePayload.previewable = args.input.pinned;
  }
  if (args.input.previewable != undefined) {
    updatePayload.previewable = args.input.previewable;
  }
  if (args.input.showcase != undefined) {
    updatePayload.showcase = args.input.showcase;
  }

  const updatedStory = await updateFirestoreDoc<StoryID, Story_Firestore>({
    id: story.id,
    payload: updatePayload,
    collection: FirestoreCollection.STORIES,
  });

  return {
    story: convertStoryToGraphQL(updatedStory),
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
  ModifyStoryResponse: {
    __resolveType(
      obj: ModifyStoryResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("story" in obj) {
        return "ModifyStoryResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
