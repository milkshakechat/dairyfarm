import { authGuardHTTP } from "@/graphql/authGuard";
import { RequestMerchantOnboardingResponse } from "@/graphql/types/resolvers-types";
import { createMerchantOnboardingStripe } from "@/services/stripe";
import { GraphQLResolveInfo } from "graphql";

export const requestMerchantOnboarding = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
): Promise<RequestMerchantOnboardingResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const registrationUrl = await createMerchantOnboardingStripe({
    userID,
  });
  return {
    registrationUrl,
  };
};

export const responses = {
  RequestMerchantOnboardingResponse: {
    __resolveType(
      obj: RequestMerchantOnboardingResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("registrationUrl" in obj) {
        return "RequestMerchantOnboardingResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
