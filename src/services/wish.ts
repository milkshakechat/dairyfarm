import { CreateWishInput } from "@/graphql/types/resolvers-types";
import {
  FirestoreCollection,
  Friendship_Firestore,
  ImageResizeOption,
  MediaSet,
  UserID,
  User_Firestore,
  WishID,
  Wish_Firestore,
  getCompressedStickerUrl,
  getCompressedWishlistGraphicUrl,
  placeholderImageThumbnail,
  placeholderSticker,
  placeholderWishlistGraphic,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  getFirestoreDoc,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
} from "./firestore";
import { v4 as uuidv4 } from "uuid";
import config from "@/config.env";

export const createWishFirestore = async (
  input: CreateWishInput,
  userID: UserID
): Promise<Wish_Firestore> => {
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  const id = uuidv4();
  const extractAssetIDFromWishUrl = (
    url: string,
    slug: "wishlist%2F" | "sticker%2F"
  ) => {
    return url.split(slug).pop()?.split(".").shift();
  };
  const galleryMediaSet: MediaSet[] =
    input.wishGraphics && input.wishGraphics.length > 0
      ? input.wishGraphics.map((url) => {
          const assetID = extractAssetIDFromWishUrl(url, "wishlist%2F");
          return {
            small: getCompressedWishlistGraphicUrl({
              userID,
              assetID: assetID || "",
              size: ImageResizeOption.thumbnail,
              bucketName: config.FIREBASE.storageBucket,
            }),
            medium: getCompressedWishlistGraphicUrl({
              userID,
              assetID: assetID || "",
              size: ImageResizeOption.compressed,
              bucketName: config.FIREBASE.storageBucket,
            }),
          };
        })
      : [
          {
            small: placeholderWishlistGraphic,
            medium: placeholderWishlistGraphic,
          },
        ];
  const thumbnail = galleryMediaSet[0].small;
  const stickerAssetID = extractAssetIDFromWishUrl(
    input.stickerGraphic || "",
    "sticker%2F"
  );
  const stickerMediaSet: MediaSet = input.stickerGraphic
    ? {
        small: getCompressedStickerUrl({
          userID,
          assetID: stickerAssetID || "",
          size: ImageResizeOption.thumbnail,
          bucketName: config.FIREBASE.storageBucket,
        }),
        medium: getCompressedStickerUrl({
          userID,
          assetID: stickerAssetID || "",
          size: ImageResizeOption.compressed,
          bucketName: config.FIREBASE.storageBucket,
        }),
      }
    : {
        small: placeholderSticker,
        medium: placeholderSticker,
      };
  const wishData: Wish_Firestore = {
    id: id as WishID,
    creatorID: userID,
    wishTitle: input.wishTitle,
    stickerTitle: input.stickerTitle || input.wishTitle,
    description: input.description || "",
    thumbnail,
    cookiePrice: input.cookiePrice,
    galleryMediaSet,
    stickerMediaSet,
    isFavorite: false,
    deleted: false,
  };
  const wish = await createFirestoreDoc<WishID, Wish_Firestore>({
    id: id as WishID,
    data: wishData,
    collection: FirestoreCollection.WISH,
  });
  return wish;
};

export const listWishlistFirestore = async ({
  targetUserID,
  requesterUserID,
}: {
  targetUserID: UserID;
  requesterUserID: UserID;
}) => {
  if (targetUserID !== requesterUserID) {
    const friendships =
      await listFirestoreDocsDoubleWhere<Friendship_Firestore>({
        where1: {
          field: "primaryUserID",
          operator: "==",
          value: requesterUserID,
        },
        where2: {
          field: "friendID",
          operator: "==",
          value: targetUserID,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
    const friendship = friendships[0];
    if (!friendship) {
      throw new Error(`You are not friends with user ${targetUserID}`);
    }
  }
  const wishlist = await listFirestoreDocs<Wish_Firestore>({
    where: {
      field: "creatorID",
      operator: "==",
      value: targetUserID,
    },
    collection: FirestoreCollection.WISH,
  });
  return wishlist.filter((w) => !w.deleted);
};
