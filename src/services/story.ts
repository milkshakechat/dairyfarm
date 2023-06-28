import {
  BucketFolderSlug,
  FirestoreCollection,
  ImageResizeOption,
  StoryID,
  Story_Firestore,
  UserID,
  StoryAttachmentType as TSStoryAttachmentType,
  StoryAttachmentID,
  getCompressedStoryImageUrl,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  decodeFirestoreTimestamp,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
} from "./firestore";
import { v4 as uuidv4 } from "uuid";
import { Story, StoryAttachmentType } from "@/graphql/types/resolvers-types";
import config from "@/config.env";
import { getFirestoreDoc } from "@/services/firestore";
import * as admin from "firebase-admin";
import {
  predictVideoThumbnailRoute,
  predictVideoTranscodedManifestRoute,
  predictVideoTranscodedSDHDRoute,
} from "./video-transcoder";

export const getImageStoryCompressed = ({
  storyID,
  userID,
  assetID,
  size,
}: {
  storyID: StoryID;
  userID: UserID;
  assetID: string;
  size: ImageResizeOption;
}) => {
  return getCompressedStoryImageUrl({
    storyID,
    userID,
    size,
    assetID,
    bucketName: config.FIREBASE.storageBucket,
  });
};

interface CreateStoryFirestoreArgs {
  mediaUrl?: string;
  mediaType?: StoryAttachmentType;
  userID: UserID;
  caption?: string;
  assetID?: string;
}
export const createStoryFirestore = async ({
  mediaUrl,
  mediaType,
  userID,
  caption,
  assetID,
}: CreateStoryFirestoreArgs) => {
  console.log(`mediaType = ${mediaType}`);
  console.log(`mediaUrl`, mediaUrl);
  const isVideo = mediaType === StoryAttachmentType.Video;
  const now = new Date();
  const defaultExpiry24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const storyID = uuidv4() as StoryID;
  const attachmentID = uuidv4() as StoryAttachmentID;
  const attachment = {
    id: attachmentID, // index
    storyID: storyID, // index
    userID: userID,
    type: mediaType as unknown as TSStoryAttachmentType, // image or video
    url: !mediaUrl
      ? ""
      : isVideo
      ? predictVideoTranscodedSDHDRoute(mediaUrl || "").sd
      : getImageStoryCompressed({
          storyID: storyID,
          userID,
          assetID: assetID || "",
          size: ImageResizeOption.compressed,
        }), // standard definition url
    thumbnail: !mediaUrl
      ? ""
      : isVideo
      ? predictVideoThumbnailRoute({
          userID,
          assetID: assetID || "",
        })
      : getImageStoryCompressed({
          storyID: storyID,
          userID,
          assetID: assetID || "",
          size: ImageResizeOption.thumbnail,
        }),
    stream: !mediaUrl
      ? ""
      : isVideo
      ? predictVideoTranscodedManifestRoute(mediaUrl)
      : undefined,
    altText: caption || "",
  };
  const storyData = {
    id: storyID,
    userID,
    // story
    caption: caption || "",
    attachments: [attachment],
    // invitePreview will allow this to appear in invite previews (dynamically retrieved)
    // since invites can generated by AudiencePage.generateInvite()
    previewable: false,
    // pinned will allow story to appear at top of profile (also dynamically retrieved)
    pinned: false,
    // showcase will allow story to appear in timeline (also dynamically retrieved)
    showcase: true,
    // thumbnails
    thumbnail: !mediaUrl
      ? ""
      : isVideo
      ? predictVideoThumbnailRoute({
          userID,
          assetID: assetID || "",
        })
      : getImageStoryCompressed({
          storyID: storyID,
          userID,
          assetID: assetID || "",
          size: ImageResizeOption.thumbnail,
        }),
    showcaseThumbnail: !mediaUrl
      ? ""
      : isVideo
      ? predictVideoThumbnailRoute({
          userID,
          assetID: assetID || "",
          size: ImageResizeOption.compressed,
        })
      : getImageStoryCompressed({
          storyID: storyID,
          userID,
          assetID: assetID || "",
          size: ImageResizeOption.thumbnail,
        }),
    // visibility
    visibleAudienceGroups: [],
    visibleFriends: [],
    visibleHashtags: [],
    // negative visibility, used for audience group exclusion
    hiddenUsers: [],
    // friends mentioned
    mentionedUsers: [],
    // wishlist mentioned
    mentionedWishlists: [],
    // duration
    expiresAt: createFirestoreTimestamp(defaultExpiry24Hours),
    // location
    // location?: StoryLocation;
    // outbound link to internet (call to action)
    // outboundLink?: string;
    // metadata
    processingComplete: isVideo ? false : true,
    createdAt: createFirestoreTimestamp(),
    deleted: false,
  };
  console.log(`storyData`, storyData);
  const story = await createFirestoreDoc<StoryID, Story_Firestore>({
    id: storyID,
    data: storyData,
    collection: FirestoreCollection.STORIES,
  });
  return story;
};

interface GetStoryFirestoreArgs {
  storyID: StoryID;
}
export const getStoryFirestore = async ({ storyID }: GetStoryFirestoreArgs) => {
  const story = await getFirestoreDoc<StoryID, Story_Firestore>({
    id: storyID,
    collection: FirestoreCollection.STORIES,
  });
  return story;
};

interface FetchStoryFeedFirestoreArgs {
  userID: UserID;
}
export const fetchStoryFeedFirestore = async ({
  userID,
}: FetchStoryFeedFirestoreArgs) => {
  const now = admin.firestore.Timestamp.now();
  const stories = await listFirestoreDocs<Story_Firestore>({
    where: {
      field: "expiryDate",
      operator: ">",
      value: now,
    },
    collection: FirestoreCollection.STORIES,
  });

  return stories.filter((s) => !s.deleted && s.showcase);
};

export const convertStoryToGraphQL = (
  story: Story_Firestore
): Omit<Story, "author"> => {
  return {
    id: story.id,
    userID: story.userID,
    caption: story.caption,
    attachments: story.attachments
      ? story.attachments.map((att) => {
          return {
            id: att.id,
            userID: att.userID,
            type: att.type as unknown as StoryAttachmentType,
            url: att.url,
            thumbnail: att.thumbnail,
            stream: att.stream,
            altText: att.altText,
          };
        })
      : [],
    pinned: story.pinned,
    showcase: story.showcase,
    thumbnail: story.thumbnail,
    showcaseThumbnail: story.showcaseThumbnail,
    outboundLink: story.outboundLink,
    createdAt: decodeFirestoreTimestamp(story.createdAt),
    expiresAt: decodeFirestoreTimestamp(story.expiresAt),
  };
};
