import { firestore } from "@/services/firebase";
import { FirestoreCollection } from "@milkshakechat/helpers";
import { DocumentReference, Query } from "firebase-admin/firestore";

interface FirestoreDocument {
  id: string;
}
interface TCreateFirestoreProps<SchemaType extends FirestoreDocument> {
  data: Omit<SchemaType, "id">;
  collection: FirestoreCollection;
}
export const createFirestoreDoc = async <SchemaType extends FirestoreDocument>({
  data,
  collection,
}: TCreateFirestoreProps<SchemaType>): Promise<SchemaType> => {
  const ref = firestore
    .collection(collection)
    .doc() as DocumentReference<SchemaType>;
  const objSchema: SchemaType = {
    id: ref.id,
    ...data,
  } as SchemaType;
  await ref.set(objSchema);
  return objSchema;
};

interface TGetFirestoreProps<SchemaID extends string> {
  id: SchemaID;
  collection: FirestoreCollection;
}
export const getFirestoreDoc = async <SchemaID extends string, SchemaType>({
  id,
  collection,
}: TGetFirestoreProps<SchemaID>): Promise<SchemaType> => {
  const ref = firestore
    .collection(collection)
    .doc(id) as DocumentReference<SchemaType>;

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw Error("No document found");
  }
  const data = snapshot.data();
  if (!data) {
    throw Error("No data found");
  }
  return data;
};

// export const firestoreCreation = async (
//   userID: UserID
// ): Promise<"___Schema"> => {
//   const userRef = db
//     .collection(Collection.User)
//     .doc(userID) as DocumentReference<User>;
//   const userSnapshot = await userRef.get();
//   const user = userSnapshot.data() as User;
//   const ____Ref = db
//     .collection(Collection._____)
//     .doc()
//     .collection(Collection._____)
//     .doc() as DocumentReference<___Schema>;
// const ___createdObjectOfSchema: ___Schema = {
//     id:____Ref.id as ____ID,
//   };
//   await ____Ref.set(___createdObjectOfSchema);
//   return ___createdObjectOfSchema;
// };

// export const firestoreUpdate = async (
//   id: SomeID,
//   payload: Omit<SomeGraphQLPayload, "___someVar">
// ): Promise<"___Schema"> => {
//   if (Object.keys(payload).length === 0) {
//     throw new Error("No data provided");
//   }
//   const ____Ref = db
//     .collection(Collection._____)
//     .doc(parentID)
//     .collection(Collection._____)
//     .doc(someID) as DocumentReference<___Schema>;
//   const ____Snapshot = await ___Ref.get();
//   if (!____Snapshot.exists) {
//     return undefined;
//   }
//   const existingObj = ____Snapshot.data();
//
//   const updatePayload: Partial<___Schema> = {};
//   // repeat
//   if (payload.__somevar != undefined) {
//     updatePayload.__somevar = payload.__somevar;
//   }
//   // until done
//   await ____Ref.update(updatePayload);
//   return (await ____Ref.get()).data() as ___Schema;
// };

// export const firestoreGet = async(
//   id: SomeID
// ): Promise<___Schema | undefined> => {
//   const ___Ref = db
//     .collection(Collection.___)
//     .doc(parentID)
//     .collection(Collection.___)
//     .doc(id) as DocumentReference<___Schema>;

//   const ____Snapshot = await ___Ref.get();

//   if (!____Snapshot.exists) {
//     return undefined;
//   } else {
//     return ____Snapshot.data();
//   }
// };

// export const firestoreList = async(
//   id: SomeID
// ): Promise<___Schema | undefined> => {
//   const ___Ref = db
//     .collection(Collection.___)
//     .doc(parentID)
//     .collection(Collection.___)
//     .where("creatorId", "==", userId)
//     .orderBy("timestamps.createdAt", "desc") as Query<___Schema>;

//     const __collectionItems = await ___Ref.get();

//     if (__collectionItems.empty) {
//       return [];
//     } else {
//       return __collectionItems.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           somevar: data.somevar,
//           timestamps: {
//             createdAt: data.timestamps.createdAt,
//             updatedAt: data.timestamps.updatedAt,
//             ...(data.timestamps.deletedAt && {
//               deletedAt: data.timestamps.deletedAt,
//             }),
//           },
//         };
//       });
//     }
// };
