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
import { GeoFireX, firestore } from "@/services/firebase";
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
import { get } from "geofirex";

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

  let stories: Story_Firestore[] = [];

  if (selfUser.prefGeoBias && selfUser.geoInfo) {
    const collection = firestore
      .collection(FirestoreCollection.STORIES)
      .where("allowSwipe", "==", true);
    const target = GeoFireX.point(selfUser.geoInfo.lat, selfUser.geoInfo.lng);
    const radius = 100; // 100km

    const query = GeoFireX.query(collection).within(target, radius, "geoFireX");
    // query.subscribe(console.log);
    const _stories: Story_Firestore[] = await get(query);
    stories = _stories;
  } else {
    const ref = firestore
      .collection(FirestoreCollection.STORIES)
      .where("allowSwipe", "==", true)
      .orderBy("createdAt", "desc")
      .limit(100) as Query<Story_Firestore>;

    const collectionItems = await ref.get();

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
  }

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
      // if (viewed || swipeDislike || swipeLike) {
      //   return false;
      // }
      return true;
    })
    .filter((s) => {
      const { author } = s;
      if (author?.id === userID) {
        return false;
      }
      if (selfUser.interestedIn.includes(author.gender)) {
        return true;
      }
      return false;
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
