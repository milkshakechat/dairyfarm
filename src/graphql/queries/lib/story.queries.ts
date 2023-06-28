import { authGuardHTTP } from "@/graphql/authGuard";
import {
  FetchStoryFeedResponse,
  FetchStoryFeedResponseSuccess,
  GetStoryResponse,
  GetStoryResponseSuccess,
  QueryFetchStoryFeedArgs,
  QueryGetStoryArgs,
  Story,
  StoryAuthor,
  User,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import { sendPushNotification } from "@/services/push";
import {
  convertStoryToGraphQL,
  fetchStoryFeedFirestore,
  getStoryFirestore,
} from "@/services/story";
import {
  FirestoreCollection,
  StoryID,
  UserID,
  User_Firestore,
  Story_Firestore,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const getStory = async (
  _parent: any,
  args: QueryGetStoryArgs,
  _context: any,
  _info: any
): Promise<{
  story: Partial<Story>;
}> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });

  const story = await getStoryFirestore({
    storyID: args.input.storyID as StoryID,
  });
  return {
    story: convertStoryToGraphQL(story),
  };
};

export const fetchStoryFeed = async (
  _parent: any,
  args: QueryFetchStoryFeedArgs,
  _context: any,
  _info: any
): Promise<{ stories: Partial<Story>[] }> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });

  const fetchedStories = await fetchStoryFeedFirestore({
    userID: userID as UserID,
  });

  return {
    stories: fetchedStories.map((story) => convertStoryToGraphQL(story)),
  };
};

export const responses = {
  GetStoryResponse: {
    __resolveType(
      obj: GetStoryResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("story" in obj) {
        return "GetStoryResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  FetchStoryFeedResponse: {
    __resolveType(
      obj: FetchStoryFeedResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("stories" in obj) {
        return "FetchStoryFeedResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};

export const CustomStoryResolvers = {
  Story: {
    author: async (parent: Story): Promise<StoryAuthor | null> => {
      const user = await getFirestoreDoc<UserID, User_Firestore>({
        collection: FirestoreCollection.USERS,
        id: parent.userID as UserID,
      });
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        displayName: user.displayName,
      };
    },
  },
};
