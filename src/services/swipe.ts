import {
  FirestoreCollection,
  StoryID,
  StoryInteractionID,
  StoryInteraction_Firestore,
  Story_Firestore,
  UserID,
  User_Firestore,
  WishBuyFrequency,
  WishID,
  WishTypeEnum,
  Wish_Firestore,
  WishlistVisibility,
  createStoryInteractionID,
} from "@milkshakechat/helpers";
import { firestore } from "@/services/firebase";
import * as admin from "firebase-admin";
import {
  createFirestoreDoc,
  getFirestoreDoc,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
  updateFirestoreDoc,
} from "./firestore";
import { InteractStoryInput } from "@/graphql/types/resolvers-types";
import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";

const appendStoryInteractionUnixTimestamp = (_unixCsv?: string) => {
  const generateStoryInterationUnixTimestamp = (_date?: Date) => {
    const date = _date ? _date : new Date();
    const unix = date?.getTime();
    return unix.toString();
  };
  const now = generateStoryInterationUnixTimestamp();
  return _unixCsv ? `${_unixCsv},${now}` : now;
};

export const fetchSwipeFeedAlgorithm = async ({
  userID,
}: {
  userID: UserID;
}) => {
  const selfUser = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });

  const ref = firestore
    .collection(FirestoreCollection.STORIES)
    .where("allowSwipe", "==", true)
    .orderBy("createdAt", "desc")
    .limit(200) as Query<Story_Firestore>;

  const collectionItems = await ref.get();

  console.log(collectionItems.docs.length);

  let stories: Story_Firestore[] = [];
  if (collectionItems.empty) {
    stories = [];
  } else {
    stories = collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<Story_Firestore>) => {
        const data = doc.data();
        return data;
      }
    );
  }

  console.log(stories);

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
              served: appendStoryInteractionUnixTimestamp(),
              viewed: ``,
              swipeLike: ``,
              swipeDislike: ``,
            },
            collection: FirestoreCollection.STORY_INTERACTIONS,
          });
          interaction = _interaction;
        }
        const author = await getFirestoreDoc<UserID, User_Firestore>({
          id: story.userID,
          collection: FirestoreCollection.USERS,
        });
        return {
          story,
          wish,
          interaction,
          author,
        };
      })
  );
  const onlyNewStories = storiesWithWish
    .filter((s) => {
      const { viewed, swipeDislike, swipeLike } = s.interaction || {};
      if (viewed || swipeDislike || swipeLike) {
        return false;
      }
      return true;
    })
    .filter((s) => {
      const { author } = s;
      if (author?.id === userID) {
        return false;
      }
      if (!selfUser.interestedIn.includes(author.gender)) {
        return false;
      }
      return true;
    });
  return onlyNewStories;
};

export const interactWithStoryAlgorithm = async (
  args: InteractStoryInput,
  userID: UserID
) => {
  const { storyID, swipeDislike, swipeLike, viewed } = args;
  let interaction: StoryInteraction_Firestore | undefined;
  try {
    const _interaction = await getFirestoreDoc<
      StoryInteractionID,
      StoryInteraction_Firestore
    >({
      id: createStoryInteractionID({
        storyID: storyID as StoryID,
        userID,
      }),
      collection: FirestoreCollection.STORY_INTERACTIONS,
    });
    interaction = _interaction;
  } catch (e) {
    console.log(e);
    console.log(`No interaction found for story ${storyID} and user ${userID}`);
    const _interaction = await createFirestoreDoc<
      StoryInteractionID,
      StoryInteraction_Firestore
    >({
      id: createStoryInteractionID({
        storyID: storyID as StoryID,
        userID,
      }),
      data: {
        id: createStoryInteractionID({
          storyID: storyID as StoryID,
          userID,
        }),
        storyID: storyID as StoryID,
        authorID: userID,
        userID: userID,
        served: ``,
        viewed: "",
        swipeLike: "",
        swipeDislike: "",
      },
      collection: FirestoreCollection.STORY_INTERACTIONS,
    });
    interaction = _interaction;
  }
  const payload: Partial<StoryInteraction_Firestore> = {};
  if (viewed) {
    payload.viewed = appendStoryInteractionUnixTimestamp(interaction?.viewed);
  }
  if (swipeLike) {
    payload.swipeLike = appendStoryInteractionUnixTimestamp(
      interaction?.swipeLike
    );
  }
  if (swipeDislike) {
    payload.swipeDislike = appendStoryInteractionUnixTimestamp(
      interaction?.swipeDislike
    );
  }
  await Promise.all([
    updateFirestoreDoc<StoryInteractionID, StoryInteraction_Firestore>({
      id: createStoryInteractionID({
        storyID: storyID as StoryID,
        userID,
      }),
      payload,
      collection: FirestoreCollection.STORY_INTERACTIONS,
    }),
  ]);
  return "success";
};
