import { firestore } from "@/services/firebase";
import { FirestoreCollection } from "@milkshakechat/helpers";
import {
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
} from "firebase-admin/firestore";
import { UpdateData } from "@firebase/firestore-types";

// creation
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

// get
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

// list
interface TListFirestoreDocsProps {
  where: {
    field: string;
    operator: WhereFilterOp;
    value: string;
  };
  collection: FirestoreCollection;
}
export const listFirestoreDocs = async <SchemaType>({
  where,
  collection,
}: TListFirestoreDocsProps): Promise<SchemaType[]> => {
  const ref = firestore
    .collection(collection)
    .where(where.field, where.operator, where.value) as Query<SchemaType>;

  const collectionItems = await ref.get();

  if (collectionItems.empty) {
    return [];
  } else {
    return collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<SchemaType>) => {
        const data = doc.data();
        return data;
      }
    );
  }
};

// update
interface TUpdateFirestoreDocProps<SchemaID extends string, SchemaType> {
  id: SchemaID;
  payload: Partial<SchemaType>;
  collection: FirestoreCollection;
}
export const updateFirestoreDoc = async <SchemaID extends string, SchemaType>({
  id,
  payload,
  collection,
}: TUpdateFirestoreDocProps<SchemaID, SchemaType>): Promise<SchemaType> => {
  if (Object.keys(payload).length === 0) {
    throw new Error("No data provided");
  }
  const ref = firestore
    .collection(collection)
    .doc(id) as DocumentReference<SchemaType>;
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    throw Error(`No document found with id ${id} in ${collection}`);
  }
  const existingObj = snapshot.data();

  if (!existingObj) {
    throw Error(
      `Nothing to update, no record found with id ${id} in ${collection}`
    );
  }

  const updatePayload: Partial<SchemaType> = {};
  // repeat
  Object.keys(payload).forEach((key) => {
    const typedKey = key as keyof SchemaType;
    if (payload[typedKey] != undefined) {
      updatePayload[typedKey] = payload[typedKey];
    }
  });
  // until done
  // @ts-ignore
  await ref.update(updatePayload as UpdateData<SchemaType>);
  const updatedObj = (await ref.get()).data();
  if (!updatedObj) {
    throw Error(`Could not find updated record with id ${id} in ${collection}`);
  }
  return updatedObj;
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
