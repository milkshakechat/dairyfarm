import { listFirestoreDocs } from "@/services/firestore";
import { FirestoreCollection, User_Firestore } from "@milkshakechat/helpers";

export const checkIfUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const users = await listFirestoreDocs<User_Firestore>({
    where: {
      field: "username",
      operator: "==",
      value: username.toLowerCase(),
    },
    collection: FirestoreCollection.USERS,
  });
  if (!users || users.length === 0) {
    return true;
  }
  return false;
};
