import { UserID } from "@milkshakechat/helpers";
import { GraphQLError } from "graphql";
import { getAuth } from "firebase-admin/auth";

export const authGuard = async ({
  _context,
  enforceAuth,
}: {
  _context: any;
  enforceAuth: boolean;
}) => {
  console.log(`--- context ---`);
  console.log(_context.connectionParams);
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
    const decodedToken = await getAuth().verifyIdToken(authorization);
    const uid = decodedToken.uid;
    console.log(`Decoded a uid = ${uid}`);
    return {
      ...status,
      userID: uid,
      idToken: authorization as string,
      isAuth: true,
    };
  } catch (e) {
    console.log(e);
    throw new GraphQLError(`Failed to decode user auth token`);
  }
};
