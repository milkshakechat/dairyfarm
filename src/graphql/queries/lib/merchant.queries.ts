import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CheckMerchantStatusResponse,
  CheckMerchantStatusResponseSuccess,
  QueryCheckMerchantStatusArgs,
} from "@/graphql/types/resolvers-types";
import { sendPushNotification } from "@/services/push";
import { checkMerchantOnboardingStatus } from "@/services/stripe";
import { GraphQLResolveInfo } from "graphql";

export const checkMerchantStatus = async (
  _parent: any,
  args: QueryCheckMerchantStatusArgs,
  _context: any,
  _info: any
): Promise<CheckMerchantStatusResponseSuccess> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }

  const summary = await checkMerchantOnboardingStatus({
    userID,
    getControlPanel: args.input.getControlPanel || false,
  });
  return {
    summary,
  };
};

export const responses = {
  CheckMerchantStatusResponse: {
    __resolveType(
      obj: CheckMerchantStatusResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("summary" in obj) {
        return "CheckMerchantStatusResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
