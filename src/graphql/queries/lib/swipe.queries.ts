import { authGuardHTTP } from "@/graphql/authGuard";
import {
  FetchSwipeFeedResponse,
  FetchSwipeFeedResponseSuccess,
  QueryDemoQueryArgs,
  QueryFetchSwipeFeedArgs,
  Story,
  Wish,
  WishBuyFrequency,
  WishTypeEnum,
  WishlistVisibility,
} from "@/graphql/types/resolvers-types";
import { sendPushNotification } from "@/services/push";
import { convertStoryToGraphQL } from "@/services/story";
import { fetchSwipeFeedAlgorithm } from "@/services/swipe";
import { GraphQLResolveInfo } from "graphql";

export const fetchSwipeFeed = async (
  _parent: any,
  args: QueryFetchSwipeFeedArgs,
  _context: any,
  _info: any
): Promise<{ swipeStack: { story: Partial<Story>; wish?: Wish }[] }> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  console.log(`fetchSwipeFeed...`);
  const feed = await fetchSwipeFeedAlgorithm({
    userID,
  });
  const swipeStack = feed.map((ss) => {
    const { story, wish } = ss;
    return {
      story: convertStoryToGraphQL(story),
      wish: wish
        ? {
            ...wish,
            buyFrequency: wish.buyFrequency as unknown as WishBuyFrequency,
            visibility: wish.visibility as unknown as WishlistVisibility,
            wishType: wish.wishType as unknown as WishTypeEnum,
          }
        : undefined,
    };
  });
  return {
    swipeStack,
  };
};

export const responses = {
  FetchSwipeFeedResponse: {
    __resolveType(
      obj: FetchSwipeFeedResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("swipeStack" in obj) {
        return "FetchSwipeFeedResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
