import { UserID } from "@milkshakechat/helpers";
import { GraphQLError } from "graphql";
import { getAuth } from "firebase-admin/auth";
import { getTokenFromBearer } from "@/utils/utils";

export const authGuard = async ({
  _context,
  enforceAuth,
}: {
  _context: any;
  enforceAuth: boolean;
}) => {
  const status: {
    userID: UserID | null;
    idToken: string | null;
    isAuth: boolean;
  } = { userID: null, idToken: null, isAuth: false };
  const { authorization } = _context.connectionParams;
  if (!authorization) {
    if (enforceAuth) {
      throw new GraphQLError(
        `You are not authorized to use this query. Please login first`
      );
    }
    return status;
  }
  try {
    const idToken = getTokenFromBearer(authorization);
    if (!idToken) {
      throw new GraphQLError(`No user auth token found in Bearer Auth`);
    }
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    return {
      ...status,
      userID: uid as UserID,
      idToken: idToken as string,
      isAuth: true,
    };
  } catch (e) {
    console.log(e);
    throw new GraphQLError(`Failed to decode user auth token`);
  }
};
