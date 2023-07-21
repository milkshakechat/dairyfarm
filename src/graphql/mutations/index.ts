export { demoMutation } from "@/graphql/mutations/lib/demo.mutations";
export {
  modifyProfile,
  updatePushToken,
  revokePushTokens,
  markNotificationsAsRead,
} from "@/graphql/mutations/lib/profile.mutations";
export {
  sendFriendRequest,
  manageFriendship,
  updateChatSettings,
} from "@/graphql/mutations/lib/friend-and-chat.mutations";
export {
  createStory,
  modifyStory,
} from "@/graphql/mutations/lib/story.mutations";
export { createWish, updateWish } from "@/graphql/mutations/lib/wish.mutations";
export { requestMerchantOnboarding } from "@/graphql/mutations/lib/merchant.mutations";
export {
  createPaymentIntent,
  sendTransfer,
  recallTransaction,
} from "@/graphql/mutations/lib/wallet.mutations";
