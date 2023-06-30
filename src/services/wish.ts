import { CreateWishInput } from "@/graphql/types/resolvers-types";
import {
  FirestoreCollection,
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
import { createFirestoreDoc, getFirestoreDoc } from "./firestore";
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
  };
  const wish = await createFirestoreDoc<WishID, Wish_Firestore>({
    id: id as WishID,
    data: wishData,
    collection: FirestoreCollection.WISH,
  });
  return wish;
};
