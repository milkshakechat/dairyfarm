import {
  CreateWishInput,
  UpdateWishInput,
} from "@/graphql/types/resolvers-types";
import {
  FirestoreCollection,
  FriendshipStatus,
  Friendship_Firestore,
  ImageResizeOption,
  MediaSet,
  UserID,
  User_Firestore,
  WishBuyFrequency,
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
  createFirestoreTimestamp,
  getFirestoreDoc,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
} from "./firestore";
import { v4 as uuidv4 } from "uuid";
import config from "@/config.env";
import { updateFirestoreDoc } from "@/services/firestore";

const extractAssetIDFromWishUrl = (
  url: string,
  slug: "wishlist%2F" | "sticker%2F"
) => {
  return url.split(slug).pop()?.split(".").shift();
};

export const createWishFirestore = async (
  input: CreateWishInput,
  userID: UserID
): Promise<Wish_Firestore> => {
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  const id = uuidv4();
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
    isFavorite: input.isFavorite || false,
    deleted: false,
    createdAt: createFirestoreTimestamp(),
    buyFrequency: input.buyFrequency as unknown as WishBuyFrequency,
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
    if (friendship.status !== FriendshipStatus.ACCEPTED) {
      console.log(`You are not friends with user ${targetUserID}`);
      return [];
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

export const getWishFirestore = async ({
  wishID,
  requesterUserID,
}: {
  requesterUserID: UserID;
  wishID: WishID;
}) => {
  const wish = await getFirestoreDoc<WishID, Wish_Firestore>({
    id: wishID,
    collection: FirestoreCollection.WISH,
  });
  if (!wish) {
    throw new Error(`Wish ${wishID} not found`);
  }
  // handle case where user the creator of this wish
  if (wish.creatorID === requesterUserID) {
    return wish;
  }
  // handle case where user is not the creator of this wish
  const friendships = await listFirestoreDocsDoubleWhere<Friendship_Firestore>({
    where1: {
      field: "primaryUserID",
      operator: "==",
      value: requesterUserID,
    },
    where2: {
      field: "friendID",
      operator: "==",
      value: wish.creatorID,
    },
    collection: FirestoreCollection.FRIENDSHIPS,
  });
  const friendship = friendships[0];
  if (!friendship) {
    throw new Error(`You are not friends with user ${wish.creatorID}`);
  }
  if (friendship.status !== FriendshipStatus.ACCEPTED) {
    throw new Error(`You are not friends with user ${wish.creatorID}`);
  }
  return wish;
};

export const updateWishFirestore = async (
  input: UpdateWishInput,
  userID: UserID
) => {
  console.log(`updateWishFirestore`, input);
  const wish = await getFirestoreDoc<WishID, Wish_Firestore>({
    id: input.wishID as WishID,
    collection: FirestoreCollection.WISH,
  });
  if (!wish) {
    throw new Error(`Wish ${input.wishID} not found`);
  }
  if (wish.creatorID !== userID) {
    throw new Error(`You are not the creator of this wish`);
  }
  const updateData: Partial<Wish_Firestore> = {};
  if (input.wishTitle) {
    updateData.wishTitle = input.wishTitle;
  }
  if (input.stickerTitle) {
    updateData.stickerTitle = input.stickerTitle;
  }
  if (input.description) {
    updateData.description = input.description;
  }
  if (input.cookiePrice) {
    updateData.cookiePrice = input.cookiePrice;
  }
  if (input.isFavorite !== undefined) {
    updateData.isFavorite = input.isFavorite || false;
  }
  if (input.buyFrequency) {
    updateData.buyFrequency = input.buyFrequency as unknown as WishBuyFrequency;
  }
  if (input.stickerGraphic) {
    const stickerAssetID = extractAssetIDFromWishUrl(
      input.stickerGraphic,
      "sticker%2F"
    );
    updateData.stickerMediaSet = {
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
    };
  }
  if (input.wishGraphics) {
    const newGraphics = input.wishGraphics || [];

    const finalSaveGraphicsSet: MediaSet[] = [];

    newGraphics.forEach((url) => {
      const mSet = wish.galleryMediaSet.find((s) => s.medium === url);
      if (mSet) {
        finalSaveGraphicsSet.push(mSet);
      } else {
        const assetID = extractAssetIDFromWishUrl(url, "wishlist%2F");
        const newSet = {
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
        finalSaveGraphicsSet.push(newSet);
      }
    });
    console.log(`finalSaveGraphicsSet`, finalSaveGraphicsSet);
    if (finalSaveGraphicsSet.length === 0) {
      finalSaveGraphicsSet.push({
        small: placeholderWishlistGraphic,
        medium: placeholderWishlistGraphic,
      });
    }
    updateData.galleryMediaSet = finalSaveGraphicsSet;
    updateData.thumbnail = finalSaveGraphicsSet[0].small;
  }
  const updatedWish = await updateFirestoreDoc<WishID, Wish_Firestore>({
    id: input.wishID as WishID,
    payload: updateData,
    collection: FirestoreCollection.WISH,
  });
  return updatedWish;
};
