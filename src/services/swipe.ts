import {
  FirestoreCollection,
  StoryInteractionID,
  StoryInteraction_Firestore,
  Story_Firestore,
  UserID,
  WishBuyFrequency,
  WishID,
  WishTypeEnum,
  Wish_Firestore,
  WishlistVisibility,
  createStoryInteractionID,
} from "@milkshakechat/helpers";
import * as admin from "firebase-admin";
import {
  createFirestoreDoc,
  getFirestoreDoc,
  listFirestoreDocs,
} from "./firestore";

export const fetchSwipeFeedAlgorithm = async ({
  userID,
}: {
  userID: UserID;
}) => {
  const stories = await listFirestoreDocs<Story_Firestore>({
    where: {
      field: "allowSwipe",
      operator: "==",
      value: true,
    },
    collection: FirestoreCollection.STORIES,
  });

  const storiesWithWish = await Promise.all(
    stories
      .filter((s) => !s.deleted && s.showcase)
      .map(async (story) => {
        let wish: Wish_Firestore | undefined;
        try {
          if (story.linkedWishID) {
            const _wish = await getFirestoreDoc<WishID, Wish_Firestore>({
              id: story.linkedWishID,
              collection: FirestoreCollection.WISH,
            });
            wish = _wish;
          }
        } catch (e) {
          console.log(e);
        }
        let interaction: StoryInteraction_Firestore | undefined;
        try {
          const _interaction = await getFirestoreDoc<
            StoryInteractionID,
            StoryInteraction_Firestore
          >({
            id: createStoryInteractionID({
              storyID: story.id,
              userID,
            }),
            collection: FirestoreCollection.STORY_INTERACTIONS,
          });
          interaction = _interaction;
        } catch (e) {
          console.log(e);
          console.log(
            `No interaction found for story ${story.id} and user ${userID}`
          );
          const _interaction = await createFirestoreDoc<
            StoryInteractionID,
            StoryInteraction_Firestore
          >({
            id: createStoryInteractionID({
              storyID: story.id,
              userID,
            }),
            data: {
              id: createStoryInteractionID({
                storyID: story.id,
                userID,
              }),
              storyID: story.id,
              authorID: story.userID,
              userID: userID,
              served: `${new Date().getTime() / 1000}`,
              viewed: ``,
              swipeLike: ``,
              swipeDislike: ``,
              initCheckout: ``,
            },
            collection: FirestoreCollection.STORY_INTERACTIONS,
          });
          interaction = _interaction;
        }
        return {
          story,
          wish,
          interaction,
        };
      })
  );

  return storiesWithWish;
};
