import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateString: { input: any; output: any; }
  GroupChatID: { input: any; output: any; }
  HexColorCode: { input: any; output: any; }
  PushToken: { input: any; output: any; }
  SendBirdInternalUserID: { input: any; output: any; }
  UserID: { input: any; output: any; }
  WalletAliasID: { input: any; output: any; }
};

export type CancelSubscriptionInput = {
  purchaseManifestID: Scalars['String']['input'];
};

export type CancelSubscriptionResponse = CancelSubscriptionResponseSuccess | ResponseError;

export type CancelSubscriptionResponseSuccess = {
  __typename?: 'CancelSubscriptionResponseSuccess';
  status: Scalars['String']['output'];
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  chatRoomID: Scalars['String']['output'];
  participants: Array<Scalars['UserID']['output']>;
  pushConfig?: Maybe<PushConfig>;
  sendBirdChannelURL?: Maybe<Scalars['String']['output']>;
  sendBirdParticipants: Array<Scalars['UserID']['output']>;
};

export type CheckMerchantStatusInput = {
  getControlPanel?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CheckMerchantStatusResponse = CheckMerchantStatusResponseSuccess | ResponseError;

export type CheckMerchantStatusResponseSuccess = {
  __typename?: 'CheckMerchantStatusResponseSuccess';
  summary: MerchantOnboardingStatusSummary;
};

export type CheckUsernameAvailableInput = {
  username: Scalars['String']['input'];
};

export type CheckUsernameAvailableResponse = CheckUsernameAvailableResponseSuccess | ResponseError;

export type CheckUsernameAvailableResponseSuccess = {
  __typename?: 'CheckUsernameAvailableResponseSuccess';
  isAvailable: Scalars['Boolean']['output'];
};

export type Contact = {
  __typename?: 'Contact';
  avatar?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  friendID: Scalars['UserID']['output'];
  status?: Maybe<FriendshipStatus>;
  username?: Maybe<Scalars['String']['output']>;
};

export type CreatePaymentIntentInput = {
  attribution?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  promoCode?: InputMaybe<Scalars['String']['input']>;
  wishSuggest: WishSuggest;
};

export type CreatePaymentIntentResponse = CreatePaymentIntentResponseSuccess | ResponseError;

export type CreatePaymentIntentResponseSuccess = {
  __typename?: 'CreatePaymentIntentResponseSuccess';
  checkoutToken?: Maybe<Scalars['String']['output']>;
  purchaseManifestID: Scalars['String']['output'];
  referenceID: Scalars['String']['output'];
};

export type CreateSetupIntentResponse = CreateSetupIntentResponseSuccess | ResponseError;

export type CreateSetupIntentResponseSuccess = {
  __typename?: 'CreateSetupIntentResponseSuccess';
  clientSecret: Scalars['String']['output'];
};

export type CreateStoryInput = {
  allowSwipe?: InputMaybe<Scalars['Boolean']['input']>;
  caption: Scalars['String']['input'];
  linkedWishID?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<StoryMediaAttachmentInput>;
};

export type CreateStoryResponse = CreateStoryResponseSuccess | ResponseError;

export type CreateStoryResponseSuccess = {
  __typename?: 'CreateStoryResponseSuccess';
  story: Story;
};

export type CreateWishInput = {
  buyFrequency?: InputMaybe<WishBuyFrequency>;
  cookiePrice: Scalars['Int']['input'];
  countdownDate?: InputMaybe<Scalars['DateString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  externalURL?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  stickerGraphic?: InputMaybe<Scalars['String']['input']>;
  stickerTitle?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<WishlistVisibility>;
  wishGraphics?: InputMaybe<Array<Scalars['String']['input']>>;
  wishTitle: Scalars['String']['input'];
  wishType: WishTypeEnum;
};

export type CreateWishResponse = CreateWishResponseSuccess | ResponseError;

export type CreateWishResponseSuccess = {
  __typename?: 'CreateWishResponseSuccess';
  wish: Wish;
};

export type DemoMutatedItem = {
  __typename?: 'DemoMutatedItem';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type DemoMutationInput = {
  name: Scalars['String']['input'];
};

export type DemoMutationResponse = DemoMutationResponseSuccess | ResponseError;

export type DemoMutationResponseSuccess = {
  __typename?: 'DemoMutationResponseSuccess';
  item: DemoMutatedItem;
};

export type DemoQueryInput = {
  name: Scalars['String']['input'];
};

export type DemoQueryResponse = DemoQueryResponseSuccess | ResponseError;

export type DemoQueryResponseSuccess = {
  __typename?: 'DemoQueryResponseSuccess';
  message: Scalars['String']['output'];
};

export type DemoSubscriptionEvent = {
  __typename?: 'DemoSubscriptionEvent';
  message: Scalars['String']['output'];
};

export type EnterChatRoomInput = {
  chatRoomID?: InputMaybe<Scalars['String']['input']>;
  participants?: InputMaybe<Array<Scalars['UserID']['input']>>;
};

export type EnterChatRoomResponse = EnterChatRoomResponseSuccess | ResponseError;

export type EnterChatRoomResponseSuccess = {
  __typename?: 'EnterChatRoomResponseSuccess';
  chatRoom: ChatRoom;
  isNew: Scalars['Boolean']['output'];
};

export type FetchRecentNotificationsInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type FetchRecentNotificationsResponse = FetchRecentNotificationsResponseSuccess | ResponseError;

export type FetchRecentNotificationsResponseSuccess = {
  __typename?: 'FetchRecentNotificationsResponseSuccess';
  notifications: Array<NotificationGql>;
};

export type FetchStoryFeedInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type FetchStoryFeedResponse = FetchStoryFeedResponseSuccess | ResponseError;

export type FetchStoryFeedResponseSuccess = {
  __typename?: 'FetchStoryFeedResponseSuccess';
  stories: Array<Story>;
};

export type FetchSwipeFeedInput = {
  nonce: Scalars['String']['input'];
};

export type FetchSwipeFeedResponse = FetchSwipeFeedResponseSuccess | ResponseError;

export type FetchSwipeFeedResponseSuccess = {
  __typename?: 'FetchSwipeFeedResponseSuccess';
  swipeStack: Array<SwipeStory>;
};

export enum FriendshipAction {
  AcceptRequest = 'ACCEPT_REQUEST',
  Block = 'BLOCK',
  CancelRequest = 'CANCEL_REQUEST',
  DeclineRequest = 'DECLINE_REQUEST',
  RemoveFriend = 'REMOVE_FRIEND',
  Unblock = 'UNBLOCK'
}

export enum FriendshipStatus {
  Accepted = 'ACCEPTED',
  Acquaintance = 'ACQUAINTANCE',
  Blocked = 'BLOCKED',
  Declined = 'DECLINED',
  GotRequest = 'GOT_REQUEST',
  None = 'NONE',
  SentRequest = 'SENT_REQUEST'
}

export enum GenderEnum {
  Female = 'female',
  Male = 'male',
  Other = 'other',
  Unknown = 'unknown'
}

export type GetMyProfileResponse = GetMyProfileResponseSuccess | ResponseError;

export type GetMyProfileResponseSuccess = {
  __typename?: 'GetMyProfileResponseSuccess';
  user: User;
};

export type GetStoryInput = {
  storyID: Scalars['ID']['input'];
};

export type GetStoryResponse = GetStoryResponseSuccess | ResponseError;

export type GetStoryResponseSuccess = {
  __typename?: 'GetStoryResponseSuccess';
  story: Story;
};

export type GetWishInput = {
  wishID: Scalars['ID']['input'];
};

export type GetWishResponse = GetWishResponseSuccess | ResponseError;

export type GetWishResponseSuccess = {
  __typename?: 'GetWishResponseSuccess';
  wish: Wish;
};

export type InteractStoryInput = {
  storyID: Scalars['ID']['input'];
  swipeDislike?: InputMaybe<Scalars['String']['input']>;
  swipeLike?: InputMaybe<Scalars['String']['input']>;
  viewed?: InputMaybe<Scalars['String']['input']>;
};

export type InteractStoryResponse = InteractStoryResponseSuccess | ResponseError;

export type InteractStoryResponseSuccess = {
  __typename?: 'InteractStoryResponseSuccess';
  status: Scalars['String']['output'];
};

export enum LanguageEnum {
  Arabic = 'arabic',
  Chinese = 'chinese',
  English = 'english',
  Japanese = 'japanese',
  Korean = 'korean',
  Spanish = 'spanish',
  Thai = 'thai',
  Vietnamese = 'vietnamese'
}

export type ListChatRoomsResponse = ListChatRoomsResponseSuccess | ResponseError;

export type ListChatRoomsResponseSuccess = {
  __typename?: 'ListChatRoomsResponseSuccess';
  chatRooms: Array<ChatRoom>;
};

export type ListContactsInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type ListContactsResponse = ListContactsResponseSuccess | ResponseError;

export type ListContactsResponseSuccess = {
  __typename?: 'ListContactsResponseSuccess';
  contacts: Array<Contact>;
};

export type ListWishlistInput = {
  userID?: InputMaybe<Scalars['UserID']['input']>;
};

export type ListWishlistResponse = ListWishlistResponseSuccess | ResponseError;

export type ListWishlistResponseSuccess = {
  __typename?: 'ListWishlistResponseSuccess';
  wishlist: Array<Wish>;
};

export type ManageFriendshipInput = {
  action: FriendshipAction;
  friendID: Scalars['UserID']['input'];
};

export type ManageFriendshipResponse = ManageFriendshipResponseSuccess | ResponseError;

export type ManageFriendshipResponseSuccess = {
  __typename?: 'ManageFriendshipResponseSuccess';
  status: FriendshipStatus;
};

export type MarkNotificationsAsReadInput = {
  read: Array<Scalars['ID']['input']>;
  unread: Array<Scalars['ID']['input']>;
};

export type MarkNotificationsAsReadResponse = MarkNotificationsAsReadResponseSuccess | ResponseError;

export type MarkNotificationsAsReadResponseSuccess = {
  __typename?: 'MarkNotificationsAsReadResponseSuccess';
  notifications: Array<NotificationGql>;
};

export type MediaSet = {
  __typename?: 'MediaSet';
  large?: Maybe<Scalars['String']['output']>;
  medium: Scalars['String']['output'];
  small: Scalars['String']['output'];
};

export type MerchantOnboardingStatusCapabilities = {
  __typename?: 'MerchantOnboardingStatusCapabilities';
  card_payments?: Maybe<Scalars['String']['output']>;
  charges_enabled: Scalars['Boolean']['output'];
  payouts_enabled: Scalars['Boolean']['output'];
  transfers?: Maybe<Scalars['String']['output']>;
};

export type MerchantOnboardingStatusSummary = {
  __typename?: 'MerchantOnboardingStatusSummary';
  anythingDue: Scalars['Boolean']['output'];
  anythingErrors: Scalars['Boolean']['output'];
  capabilities: MerchantOnboardingStatusCapabilities;
  email: Scalars['String']['output'];
  escrowWallet: Scalars['ID']['output'];
  hasMerchantPrivilege: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  stripeMerchantID?: Maybe<Scalars['ID']['output']>;
  stripePortalUrl?: Maybe<Scalars['String']['output']>;
  tradingWallet: Scalars['ID']['output'];
  userID: Scalars['ID']['output'];
};

export type ModifyProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<GenderEnum>;
  interestedIn?: InputMaybe<Array<GenderEnum>>;
  language?: InputMaybe<LanguageEnum>;
  link?: InputMaybe<Scalars['String']['input']>;
  privacyMode?: InputMaybe<PrivacyModeEnum>;
  themeColor?: InputMaybe<Scalars['HexColorCode']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type ModifyProfileResponse = ModifyProfileResponseSuccess | ResponseError;

export type ModifyProfileResponseSuccess = {
  __typename?: 'ModifyProfileResponseSuccess';
  user: User;
};

export type ModifyStoryInput = {
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  previewable?: InputMaybe<Scalars['Boolean']['input']>;
  showcase?: InputMaybe<Scalars['Boolean']['input']>;
  storyID: Scalars['ID']['input'];
};

export type ModifyStoryResponse = ModifyStoryResponseSuccess | ResponseError;

export type ModifyStoryResponseSuccess = {
  __typename?: 'ModifyStoryResponseSuccess';
  story: Story;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelSubscription: CancelSubscriptionResponse;
  createPaymentIntent: CreatePaymentIntentResponse;
  createSetupIntent: CreateSetupIntentResponse;
  createStory: CreateStoryResponse;
  createWish: CreateWishResponse;
  demoMutation: DemoMutationResponse;
  interactStory: InteractStoryResponse;
  manageFriendship: ManageFriendshipResponse;
  markNotificationsAsRead: MarkNotificationsAsReadResponse;
  modifyProfile: ModifyProfileResponse;
  modifyStory: ModifyStoryResponse;
  recallTransaction: RecallTransactionResponse;
  requestMerchantOnboarding: RequestMerchantOnboardingResponse;
  revokePushTokens: RevokePushTokensResponse;
  savePaymentMethod: SavePaymentMethodResponse;
  sendFriendRequest: SendFriendRequestResponse;
  sendTransfer: SendTransferResponse;
  topUpWallet: TopUpWalletResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updatePushToken: UpdatePushTokenResponse;
  updateWish: UpdateWishResponse;
};


export type MutationCancelSubscriptionArgs = {
  input: CancelSubscriptionInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};


export type MutationCreateStoryArgs = {
  input: CreateStoryInput;
};


export type MutationCreateWishArgs = {
  input: CreateWishInput;
};


export type MutationDemoMutationArgs = {
  input: DemoMutationInput;
};


export type MutationInteractStoryArgs = {
  input: InteractStoryInput;
};


export type MutationManageFriendshipArgs = {
  input: ManageFriendshipInput;
};


export type MutationMarkNotificationsAsReadArgs = {
  input: MarkNotificationsAsReadInput;
};


export type MutationModifyProfileArgs = {
  input: ModifyProfileInput;
};


export type MutationModifyStoryArgs = {
  input: ModifyStoryInput;
};


export type MutationRecallTransactionArgs = {
  input: RecallTransactionInput;
};


export type MutationSavePaymentMethodArgs = {
  input: SavePaymentMethodInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type MutationSendTransferArgs = {
  input: SendTransferInput;
};


export type MutationTopUpWalletArgs = {
  input: TopUpWalletInput;
};


export type MutationUpdateChatSettingsArgs = {
  input: UpdateChatSettingsInput;
};


export type MutationUpdatePushTokenArgs = {
  input: UpdatePushTokenInput;
};


export type MutationUpdateWishArgs = {
  input: UpdateWishInput;
};

export type NotificationGql = {
  __typename?: 'NotificationGql';
  createdAt: Scalars['DateString']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  markedRead: Scalars['Boolean']['output'];
  relatedChatRoomID?: Maybe<Scalars['ID']['output']>;
  route?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Ping = {
  __typename?: 'Ping';
  timestamp: Scalars['String']['output'];
};

export enum PrivacyModeEnum {
  Hidden = 'hidden',
  Private = 'private',
  Public = 'public'
}

export type PushConfig = {
  __typename?: 'PushConfig';
  allowPush?: Maybe<Scalars['Boolean']['output']>;
  snoozeUntil?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  checkMerchantStatus: CheckMerchantStatusResponse;
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  enterChatRoom: EnterChatRoomResponse;
  fetchRecentNotifications: FetchRecentNotificationsResponse;
  fetchStoryFeed: FetchStoryFeedResponse;
  fetchSwipeFeed: FetchSwipeFeedResponse;
  getMyProfile: GetMyProfileResponse;
  getStory: GetStoryResponse;
  getWish: GetWishResponse;
  listChatRooms: ListChatRoomsResponse;
  listContacts: ListContactsResponse;
  listWishlist: ListWishlistResponse;
  ping: Ping;
  viewPublicProfile: ViewPublicProfileResponse;
};


export type QueryCheckMerchantStatusArgs = {
  input: CheckMerchantStatusInput;
};


export type QueryCheckUsernameAvailableArgs = {
  input: CheckUsernameAvailableInput;
};


export type QueryDemoQueryArgs = {
  input: DemoQueryInput;
};


export type QueryEnterChatRoomArgs = {
  input: EnterChatRoomInput;
};


export type QueryFetchRecentNotificationsArgs = {
  input: FetchRecentNotificationsInput;
};


export type QueryFetchStoryFeedArgs = {
  input: FetchStoryFeedInput;
};


export type QueryFetchSwipeFeedArgs = {
  input: FetchSwipeFeedInput;
};


export type QueryGetStoryArgs = {
  input: GetStoryInput;
};


export type QueryGetWishArgs = {
  input: GetWishInput;
};


export type QueryListContactsArgs = {
  input: ListContactsInput;
};


export type QueryListWishlistArgs = {
  input: ListWishlistInput;
};


export type QueryViewPublicProfileArgs = {
  input: ViewPublicProfileInput;
};

export type RecallTransactionInput = {
  recallerNote?: InputMaybe<Scalars['String']['input']>;
  txMirrorID: Scalars['String']['input'];
};

export type RecallTransactionResponse = RecallTransactionResponseSuccess | ResponseError;

export type RecallTransactionResponseSuccess = {
  __typename?: 'RecallTransactionResponseSuccess';
  referenceID: Scalars['String']['output'];
};

export type RequestMerchantOnboardingResponse = RequestMerchantOnboardingResponseSuccess | ResponseError;

export type RequestMerchantOnboardingResponseSuccess = {
  __typename?: 'RequestMerchantOnboardingResponseSuccess';
  registrationUrl: Scalars['String']['output'];
};

export type ResponseError = {
  __typename?: 'ResponseError';
  error: Status;
};

export type RevokePushTokensResponse = ResponseError | RevokePushTokensResponseSuccess;

export type RevokePushTokensResponseSuccess = {
  __typename?: 'RevokePushTokensResponseSuccess';
  status: Scalars['String']['output'];
};

export type SavePaymentMethodInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  paymentMethodID: Scalars['String']['input'];
};

export type SavePaymentMethodResponse = ResponseError | SavePaymentMethodResponseSuccess;

export type SavePaymentMethodResponseSuccess = {
  __typename?: 'SavePaymentMethodResponseSuccess';
  paymentMethodID: Scalars['String']['output'];
};

export type SendFriendRequestInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  recipientID: Scalars['UserID']['input'];
  utmAttribution?: InputMaybe<Scalars['String']['input']>;
};

export type SendFriendRequestResponse = ResponseError | SendFriendRequestResponseSuccess;

export type SendFriendRequestResponseSuccess = {
  __typename?: 'SendFriendRequestResponseSuccess';
  status: FriendshipStatus;
};

export type SendTransferInput = {
  amount: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  recipientID: Scalars['UserID']['input'];
};

export type SendTransferResponse = ResponseError | SendTransferResponseSuccess;

export type SendTransferResponseSuccess = {
  __typename?: 'SendTransferResponseSuccess';
  referenceID: Scalars['String']['output'];
};

export type Status = {
  __typename?: 'Status';
  code: StatusCode;
  message: Scalars['String']['output'];
};

export enum StatusCode {
  BadRequest = 'BadRequest',
  Forbidden = 'Forbidden',
  InvalidOperation = 'InvalidOperation',
  NotFound = 'NotFound',
  NotImplemented = 'NotImplemented',
  ServerError = 'ServerError',
  Success = 'Success',
  Unauthorized = 'Unauthorized'
}

export type Story = {
  __typename?: 'Story';
  attachments: Array<StoryAttachment>;
  author: StoryAuthor;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateString']['output']>;
  expiresAt?: Maybe<Scalars['DateString']['output']>;
  id: Scalars['ID']['output'];
  linkedWishID?: Maybe<Scalars['String']['output']>;
  outboundLink?: Maybe<Scalars['String']['output']>;
  pinned?: Maybe<Scalars['Boolean']['output']>;
  showcase?: Maybe<Scalars['Boolean']['output']>;
  showcaseThumbnail?: Maybe<Scalars['String']['output']>;
  thumbnail: Scalars['String']['output'];
  userID: Scalars['UserID']['output'];
};

export type StoryAttachment = {
  __typename?: 'StoryAttachment';
  altText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  stream?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: StoryAttachmentType;
  url: Scalars['String']['output'];
  userID: Scalars['UserID']['output'];
};

export enum StoryAttachmentType {
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type StoryAuthor = {
  __typename?: 'StoryAuthor';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  username: Scalars['String']['output'];
};

export type StoryMediaAttachmentInput = {
  assetID: Scalars['String']['input'];
  type: StoryAttachmentType;
  url: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
};

export type SwipeStory = {
  __typename?: 'SwipeStory';
  story: Story;
  wish?: Maybe<Wish>;
};

export type TopUpWalletInput = {
  amount: Scalars['Int']['input'];
  promoCode?: InputMaybe<Scalars['String']['input']>;
};

export type TopUpWalletResponse = ResponseError | TopUpWalletResponseSuccess;

export type TopUpWalletResponseSuccess = {
  __typename?: 'TopUpWalletResponseSuccess';
  checkoutToken?: Maybe<Scalars['String']['output']>;
  purchaseManifestID: Scalars['String']['output'];
  referenceID: Scalars['String']['output'];
};

export type UpdateChatSettingsInput = {
  allowPush?: InputMaybe<Scalars['Boolean']['input']>;
  chatRoomID: Scalars['String']['input'];
  snoozeUntil?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChatSettingsResponse = ResponseError | UpdateChatSettingsResponseSuccess;

export type UpdateChatSettingsResponseSuccess = {
  __typename?: 'UpdateChatSettingsResponseSuccess';
  chatRoom: ChatRoom;
};

export type UpdatePushTokenInput = {
  active: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['PushToken']['input'];
};

export type UpdatePushTokenResponse = ResponseError | UpdatePushTokenResponseSuccess;

export type UpdatePushTokenResponseSuccess = {
  __typename?: 'UpdatePushTokenResponseSuccess';
  status: Scalars['String']['output'];
};

export type UpdateWishInput = {
  buyFrequency?: InputMaybe<WishBuyFrequency>;
  cookiePrice?: InputMaybe<Scalars['Int']['input']>;
  countdownDate?: InputMaybe<Scalars['DateString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  externalURL?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  stickerGraphic?: InputMaybe<Scalars['String']['input']>;
  stickerTitle?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<WishlistVisibility>;
  wishGraphics?: InputMaybe<Array<Scalars['String']['input']>>;
  wishID: Scalars['ID']['input'];
  wishTitle?: InputMaybe<Scalars['String']['input']>;
  wishType?: InputMaybe<WishTypeEnum>;
};

export type UpdateWishResponse = ResponseError | UpdateWishResponseSuccess;

export type UpdateWishResponseSuccess = {
  __typename?: 'UpdateWishResponseSuccess';
  wish: Wish;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  bio: Scalars['String']['output'];
  createdAt: Scalars['DateString']['output'];
  defaultPaymentMethodID?: Maybe<Scalars['String']['output']>;
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  escrowWallet?: Maybe<Scalars['WalletAliasID']['output']>;
  gender: GenderEnum;
  id: Scalars['UserID']['output'];
  interestedIn: Array<GenderEnum>;
  isCreator: Scalars['Boolean']['output'];
  isPaidChat: Scalars['Boolean']['output'];
  language: LanguageEnum;
  link: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  privacyMode: PrivacyModeEnum;
  sendBirdAccessToken?: Maybe<Scalars['String']['output']>;
  stories: Array<Story>;
  themeColor: Scalars['HexColorCode']['output'];
  tradingWallet?: Maybe<Scalars['WalletAliasID']['output']>;
  username: Scalars['String']['output'];
};

export type ViewPublicProfileInput = {
  userID?: InputMaybe<Scalars['UserID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type ViewPublicProfileResponse = ResponseError | ViewPublicProfileResponseSuccess;

export type ViewPublicProfileResponseSuccess = {
  __typename?: 'ViewPublicProfileResponseSuccess';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UserID']['output'];
  privacyMode: PrivacyModeEnum;
  stories: Array<Story>;
  username: Scalars['String']['output'];
};

export type Wish = {
  __typename?: 'Wish';
  author?: Maybe<WishAuthor>;
  buyFrequency: WishBuyFrequency;
  cookiePrice: Scalars['Int']['output'];
  countdownDate?: Maybe<Scalars['DateString']['output']>;
  createdAt: Scalars['DateString']['output'];
  creatorID: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  externalURL?: Maybe<Scalars['String']['output']>;
  galleryMediaSet: Array<MediaSet>;
  id: Scalars['ID']['output'];
  isFavorite: Scalars['Boolean']['output'];
  stickerMediaSet: MediaSet;
  stickerTitle: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
  visibility: WishlistVisibility;
  wishTitle: Scalars['String']['output'];
  wishType: WishTypeEnum;
};

export type WishAuthor = {
  __typename?: 'WishAuthor';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  username: Scalars['String']['output'];
};

export enum WishBuyFrequency {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  OneTime = 'ONE_TIME',
  Weekly = 'WEEKLY'
}

export type WishSuggest = {
  suggestedAmount?: InputMaybe<Scalars['Int']['input']>;
  suggestedFrequency?: InputMaybe<WishBuyFrequency>;
  wishID: Scalars['ID']['input'];
};

export enum WishTypeEnum {
  Event = 'EVENT',
  Gift = 'GIFT'
}

export enum WishlistVisibility {
  FriendsOnly = 'FRIENDS_ONLY',
  Hidden = 'HIDDEN',
  PublicMarketplace = 'PUBLIC_MARKETPLACE'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  CancelSubscriptionResponse: ( CancelSubscriptionResponseSuccess ) | ( ResponseError );
  CheckMerchantStatusResponse: ( CheckMerchantStatusResponseSuccess ) | ( ResponseError );
  CheckUsernameAvailableResponse: ( CheckUsernameAvailableResponseSuccess ) | ( ResponseError );
  CreatePaymentIntentResponse: ( CreatePaymentIntentResponseSuccess ) | ( ResponseError );
  CreateSetupIntentResponse: ( CreateSetupIntentResponseSuccess ) | ( ResponseError );
  CreateStoryResponse: ( CreateStoryResponseSuccess ) | ( ResponseError );
  CreateWishResponse: ( CreateWishResponseSuccess ) | ( ResponseError );
  DemoMutationResponse: ( DemoMutationResponseSuccess ) | ( ResponseError );
  DemoQueryResponse: ( DemoQueryResponseSuccess ) | ( ResponseError );
  EnterChatRoomResponse: ( EnterChatRoomResponseSuccess ) | ( ResponseError );
  FetchRecentNotificationsResponse: ( FetchRecentNotificationsResponseSuccess ) | ( ResponseError );
  FetchStoryFeedResponse: ( FetchStoryFeedResponseSuccess ) | ( ResponseError );
  FetchSwipeFeedResponse: ( FetchSwipeFeedResponseSuccess ) | ( ResponseError );
  GetMyProfileResponse: ( GetMyProfileResponseSuccess ) | ( ResponseError );
  GetStoryResponse: ( GetStoryResponseSuccess ) | ( ResponseError );
  GetWishResponse: ( GetWishResponseSuccess ) | ( ResponseError );
  InteractStoryResponse: ( InteractStoryResponseSuccess ) | ( ResponseError );
  ListChatRoomsResponse: ( ListChatRoomsResponseSuccess ) | ( ResponseError );
  ListContactsResponse: ( ListContactsResponseSuccess ) | ( ResponseError );
  ListWishlistResponse: ( ListWishlistResponseSuccess ) | ( ResponseError );
  ManageFriendshipResponse: ( ManageFriendshipResponseSuccess ) | ( ResponseError );
  MarkNotificationsAsReadResponse: ( MarkNotificationsAsReadResponseSuccess ) | ( ResponseError );
  ModifyProfileResponse: ( ModifyProfileResponseSuccess ) | ( ResponseError );
  ModifyStoryResponse: ( ModifyStoryResponseSuccess ) | ( ResponseError );
  RecallTransactionResponse: ( RecallTransactionResponseSuccess ) | ( ResponseError );
  RequestMerchantOnboardingResponse: ( RequestMerchantOnboardingResponseSuccess ) | ( ResponseError );
  RevokePushTokensResponse: ( ResponseError ) | ( RevokePushTokensResponseSuccess );
  SavePaymentMethodResponse: ( ResponseError ) | ( SavePaymentMethodResponseSuccess );
  SendFriendRequestResponse: ( ResponseError ) | ( SendFriendRequestResponseSuccess );
  SendTransferResponse: ( ResponseError ) | ( SendTransferResponseSuccess );
  TopUpWalletResponse: ( ResponseError ) | ( TopUpWalletResponseSuccess );
  UpdateChatSettingsResponse: ( ResponseError ) | ( UpdateChatSettingsResponseSuccess );
  UpdatePushTokenResponse: ( ResponseError ) | ( UpdatePushTokenResponseSuccess );
  UpdateWishResponse: ( ResponseError ) | ( UpdateWishResponseSuccess );
  ViewPublicProfileResponse: ( ResponseError ) | ( ViewPublicProfileResponseSuccess );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CancelSubscriptionInput: CancelSubscriptionInput;
  CancelSubscriptionResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CancelSubscriptionResponse']>;
  CancelSubscriptionResponseSuccess: ResolverTypeWrapper<CancelSubscriptionResponseSuccess>;
  ChatRoom: ResolverTypeWrapper<ChatRoom>;
  CheckMerchantStatusInput: CheckMerchantStatusInput;
  CheckMerchantStatusResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CheckMerchantStatusResponse']>;
  CheckMerchantStatusResponseSuccess: ResolverTypeWrapper<CheckMerchantStatusResponseSuccess>;
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CheckUsernameAvailableResponse']>;
  CheckUsernameAvailableResponseSuccess: ResolverTypeWrapper<CheckUsernameAvailableResponseSuccess>;
  Contact: ResolverTypeWrapper<Contact>;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreatePaymentIntentResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatePaymentIntentResponse']>;
  CreatePaymentIntentResponseSuccess: ResolverTypeWrapper<CreatePaymentIntentResponseSuccess>;
  CreateSetupIntentResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateSetupIntentResponse']>;
  CreateSetupIntentResponseSuccess: ResolverTypeWrapper<CreateSetupIntentResponseSuccess>;
  CreateStoryInput: CreateStoryInput;
  CreateStoryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateStoryResponse']>;
  CreateStoryResponseSuccess: ResolverTypeWrapper<CreateStoryResponseSuccess>;
  CreateWishInput: CreateWishInput;
  CreateWishResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateWishResponse']>;
  CreateWishResponseSuccess: ResolverTypeWrapper<CreateWishResponseSuccess>;
  DateString: ResolverTypeWrapper<Scalars['DateString']['output']>;
  DemoMutatedItem: ResolverTypeWrapper<DemoMutatedItem>;
  DemoMutationInput: DemoMutationInput;
  DemoMutationResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DemoMutationResponse']>;
  DemoMutationResponseSuccess: ResolverTypeWrapper<DemoMutationResponseSuccess>;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DemoQueryResponse']>;
  DemoQueryResponseSuccess: ResolverTypeWrapper<DemoQueryResponseSuccess>;
  DemoSubscriptionEvent: ResolverTypeWrapper<DemoSubscriptionEvent>;
  EnterChatRoomInput: EnterChatRoomInput;
  EnterChatRoomResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EnterChatRoomResponse']>;
  EnterChatRoomResponseSuccess: ResolverTypeWrapper<EnterChatRoomResponseSuccess>;
  FetchRecentNotificationsInput: FetchRecentNotificationsInput;
  FetchRecentNotificationsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['FetchRecentNotificationsResponse']>;
  FetchRecentNotificationsResponseSuccess: ResolverTypeWrapper<FetchRecentNotificationsResponseSuccess>;
  FetchStoryFeedInput: FetchStoryFeedInput;
  FetchStoryFeedResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['FetchStoryFeedResponse']>;
  FetchStoryFeedResponseSuccess: ResolverTypeWrapper<FetchStoryFeedResponseSuccess>;
  FetchSwipeFeedInput: FetchSwipeFeedInput;
  FetchSwipeFeedResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['FetchSwipeFeedResponse']>;
  FetchSwipeFeedResponseSuccess: ResolverTypeWrapper<FetchSwipeFeedResponseSuccess>;
  FriendshipAction: FriendshipAction;
  FriendshipStatus: FriendshipStatus;
  GenderEnum: GenderEnum;
  GetMyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetMyProfileResponse']>;
  GetMyProfileResponseSuccess: ResolverTypeWrapper<GetMyProfileResponseSuccess>;
  GetStoryInput: GetStoryInput;
  GetStoryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetStoryResponse']>;
  GetStoryResponseSuccess: ResolverTypeWrapper<GetStoryResponseSuccess>;
  GetWishInput: GetWishInput;
  GetWishResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetWishResponse']>;
  GetWishResponseSuccess: ResolverTypeWrapper<GetWishResponseSuccess>;
  GroupChatID: ResolverTypeWrapper<Scalars['GroupChatID']['output']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InteractStoryInput: InteractStoryInput;
  InteractStoryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['InteractStoryResponse']>;
  InteractStoryResponseSuccess: ResolverTypeWrapper<InteractStoryResponseSuccess>;
  LanguageEnum: LanguageEnum;
  ListChatRoomsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListChatRoomsResponse']>;
  ListChatRoomsResponseSuccess: ResolverTypeWrapper<ListChatRoomsResponseSuccess>;
  ListContactsInput: ListContactsInput;
  ListContactsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListContactsResponse']>;
  ListContactsResponseSuccess: ResolverTypeWrapper<ListContactsResponseSuccess>;
  ListWishlistInput: ListWishlistInput;
  ListWishlistResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListWishlistResponse']>;
  ListWishlistResponseSuccess: ResolverTypeWrapper<ListWishlistResponseSuccess>;
  ManageFriendshipInput: ManageFriendshipInput;
  ManageFriendshipResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ManageFriendshipResponse']>;
  ManageFriendshipResponseSuccess: ResolverTypeWrapper<ManageFriendshipResponseSuccess>;
  MarkNotificationsAsReadInput: MarkNotificationsAsReadInput;
  MarkNotificationsAsReadResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['MarkNotificationsAsReadResponse']>;
  MarkNotificationsAsReadResponseSuccess: ResolverTypeWrapper<MarkNotificationsAsReadResponseSuccess>;
  MediaSet: ResolverTypeWrapper<MediaSet>;
  MerchantOnboardingStatusCapabilities: ResolverTypeWrapper<MerchantOnboardingStatusCapabilities>;
  MerchantOnboardingStatusSummary: ResolverTypeWrapper<MerchantOnboardingStatusSummary>;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ModifyProfileResponse']>;
  ModifyProfileResponseSuccess: ResolverTypeWrapper<ModifyProfileResponseSuccess>;
  ModifyStoryInput: ModifyStoryInput;
  ModifyStoryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ModifyStoryResponse']>;
  ModifyStoryResponseSuccess: ResolverTypeWrapper<ModifyStoryResponseSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationGql: ResolverTypeWrapper<NotificationGql>;
  Ping: ResolverTypeWrapper<Ping>;
  PrivacyModeEnum: PrivacyModeEnum;
  PushConfig: ResolverTypeWrapper<PushConfig>;
  PushToken: ResolverTypeWrapper<Scalars['PushToken']['output']>;
  Query: ResolverTypeWrapper<{}>;
  RecallTransactionInput: RecallTransactionInput;
  RecallTransactionResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RecallTransactionResponse']>;
  RecallTransactionResponseSuccess: ResolverTypeWrapper<RecallTransactionResponseSuccess>;
  RequestMerchantOnboardingResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RequestMerchantOnboardingResponse']>;
  RequestMerchantOnboardingResponseSuccess: ResolverTypeWrapper<RequestMerchantOnboardingResponseSuccess>;
  ResponseError: ResolverTypeWrapper<ResponseError>;
  RevokePushTokensResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RevokePushTokensResponse']>;
  RevokePushTokensResponseSuccess: ResolverTypeWrapper<RevokePushTokensResponseSuccess>;
  SavePaymentMethodInput: SavePaymentMethodInput;
  SavePaymentMethodResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SavePaymentMethodResponse']>;
  SavePaymentMethodResponseSuccess: ResolverTypeWrapper<SavePaymentMethodResponseSuccess>;
  SendBirdInternalUserID: ResolverTypeWrapper<Scalars['SendBirdInternalUserID']['output']>;
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SendFriendRequestResponse']>;
  SendFriendRequestResponseSuccess: ResolverTypeWrapper<SendFriendRequestResponseSuccess>;
  SendTransferInput: SendTransferInput;
  SendTransferResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SendTransferResponse']>;
  SendTransferResponseSuccess: ResolverTypeWrapper<SendTransferResponseSuccess>;
  Status: ResolverTypeWrapper<Status>;
  StatusCode: StatusCode;
  Story: ResolverTypeWrapper<Story>;
  StoryAttachment: ResolverTypeWrapper<StoryAttachment>;
  StoryAttachmentType: StoryAttachmentType;
  StoryAuthor: ResolverTypeWrapper<StoryAuthor>;
  StoryMediaAttachmentInput: StoryMediaAttachmentInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  SwipeStory: ResolverTypeWrapper<SwipeStory>;
  TopUpWalletInput: TopUpWalletInput;
  TopUpWalletResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TopUpWalletResponse']>;
  TopUpWalletResponseSuccess: ResolverTypeWrapper<TopUpWalletResponseSuccess>;
  UpdateChatSettingsInput: UpdateChatSettingsInput;
  UpdateChatSettingsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateChatSettingsResponse']>;
  UpdateChatSettingsResponseSuccess: ResolverTypeWrapper<UpdateChatSettingsResponseSuccess>;
  UpdatePushTokenInput: UpdatePushTokenInput;
  UpdatePushTokenResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdatePushTokenResponse']>;
  UpdatePushTokenResponseSuccess: ResolverTypeWrapper<UpdatePushTokenResponseSuccess>;
  UpdateWishInput: UpdateWishInput;
  UpdateWishResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateWishResponse']>;
  UpdateWishResponseSuccess: ResolverTypeWrapper<UpdateWishResponseSuccess>;
  User: ResolverTypeWrapper<User>;
  UserID: ResolverTypeWrapper<Scalars['UserID']['output']>;
  ViewPublicProfileInput: ViewPublicProfileInput;
  ViewPublicProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ViewPublicProfileResponse']>;
  ViewPublicProfileResponseSuccess: ResolverTypeWrapper<ViewPublicProfileResponseSuccess>;
  WalletAliasID: ResolverTypeWrapper<Scalars['WalletAliasID']['output']>;
  Wish: ResolverTypeWrapper<Wish>;
  WishAuthor: ResolverTypeWrapper<WishAuthor>;
  WishBuyFrequency: WishBuyFrequency;
  WishSuggest: WishSuggest;
  WishTypeEnum: WishTypeEnum;
  WishlistVisibility: WishlistVisibility;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CancelSubscriptionInput: CancelSubscriptionInput;
  CancelSubscriptionResponse: ResolversUnionTypes<ResolversParentTypes>['CancelSubscriptionResponse'];
  CancelSubscriptionResponseSuccess: CancelSubscriptionResponseSuccess;
  ChatRoom: ChatRoom;
  CheckMerchantStatusInput: CheckMerchantStatusInput;
  CheckMerchantStatusResponse: ResolversUnionTypes<ResolversParentTypes>['CheckMerchantStatusResponse'];
  CheckMerchantStatusResponseSuccess: CheckMerchantStatusResponseSuccess;
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolversUnionTypes<ResolversParentTypes>['CheckUsernameAvailableResponse'];
  CheckUsernameAvailableResponseSuccess: CheckUsernameAvailableResponseSuccess;
  Contact: Contact;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreatePaymentIntentResponse: ResolversUnionTypes<ResolversParentTypes>['CreatePaymentIntentResponse'];
  CreatePaymentIntentResponseSuccess: CreatePaymentIntentResponseSuccess;
  CreateSetupIntentResponse: ResolversUnionTypes<ResolversParentTypes>['CreateSetupIntentResponse'];
  CreateSetupIntentResponseSuccess: CreateSetupIntentResponseSuccess;
  CreateStoryInput: CreateStoryInput;
  CreateStoryResponse: ResolversUnionTypes<ResolversParentTypes>['CreateStoryResponse'];
  CreateStoryResponseSuccess: CreateStoryResponseSuccess;
  CreateWishInput: CreateWishInput;
  CreateWishResponse: ResolversUnionTypes<ResolversParentTypes>['CreateWishResponse'];
  CreateWishResponseSuccess: CreateWishResponseSuccess;
  DateString: Scalars['DateString']['output'];
  DemoMutatedItem: DemoMutatedItem;
  DemoMutationInput: DemoMutationInput;
  DemoMutationResponse: ResolversUnionTypes<ResolversParentTypes>['DemoMutationResponse'];
  DemoMutationResponseSuccess: DemoMutationResponseSuccess;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolversUnionTypes<ResolversParentTypes>['DemoQueryResponse'];
  DemoQueryResponseSuccess: DemoQueryResponseSuccess;
  DemoSubscriptionEvent: DemoSubscriptionEvent;
  EnterChatRoomInput: EnterChatRoomInput;
  EnterChatRoomResponse: ResolversUnionTypes<ResolversParentTypes>['EnterChatRoomResponse'];
  EnterChatRoomResponseSuccess: EnterChatRoomResponseSuccess;
  FetchRecentNotificationsInput: FetchRecentNotificationsInput;
  FetchRecentNotificationsResponse: ResolversUnionTypes<ResolversParentTypes>['FetchRecentNotificationsResponse'];
  FetchRecentNotificationsResponseSuccess: FetchRecentNotificationsResponseSuccess;
  FetchStoryFeedInput: FetchStoryFeedInput;
  FetchStoryFeedResponse: ResolversUnionTypes<ResolversParentTypes>['FetchStoryFeedResponse'];
  FetchStoryFeedResponseSuccess: FetchStoryFeedResponseSuccess;
  FetchSwipeFeedInput: FetchSwipeFeedInput;
  FetchSwipeFeedResponse: ResolversUnionTypes<ResolversParentTypes>['FetchSwipeFeedResponse'];
  FetchSwipeFeedResponseSuccess: FetchSwipeFeedResponseSuccess;
  GetMyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['GetMyProfileResponse'];
  GetMyProfileResponseSuccess: GetMyProfileResponseSuccess;
  GetStoryInput: GetStoryInput;
  GetStoryResponse: ResolversUnionTypes<ResolversParentTypes>['GetStoryResponse'];
  GetStoryResponseSuccess: GetStoryResponseSuccess;
  GetWishInput: GetWishInput;
  GetWishResponse: ResolversUnionTypes<ResolversParentTypes>['GetWishResponse'];
  GetWishResponseSuccess: GetWishResponseSuccess;
  GroupChatID: Scalars['GroupChatID']['output'];
  HexColorCode: Scalars['HexColorCode']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InteractStoryInput: InteractStoryInput;
  InteractStoryResponse: ResolversUnionTypes<ResolversParentTypes>['InteractStoryResponse'];
  InteractStoryResponseSuccess: InteractStoryResponseSuccess;
  ListChatRoomsResponse: ResolversUnionTypes<ResolversParentTypes>['ListChatRoomsResponse'];
  ListChatRoomsResponseSuccess: ListChatRoomsResponseSuccess;
  ListContactsInput: ListContactsInput;
  ListContactsResponse: ResolversUnionTypes<ResolversParentTypes>['ListContactsResponse'];
  ListContactsResponseSuccess: ListContactsResponseSuccess;
  ListWishlistInput: ListWishlistInput;
  ListWishlistResponse: ResolversUnionTypes<ResolversParentTypes>['ListWishlistResponse'];
  ListWishlistResponseSuccess: ListWishlistResponseSuccess;
  ManageFriendshipInput: ManageFriendshipInput;
  ManageFriendshipResponse: ResolversUnionTypes<ResolversParentTypes>['ManageFriendshipResponse'];
  ManageFriendshipResponseSuccess: ManageFriendshipResponseSuccess;
  MarkNotificationsAsReadInput: MarkNotificationsAsReadInput;
  MarkNotificationsAsReadResponse: ResolversUnionTypes<ResolversParentTypes>['MarkNotificationsAsReadResponse'];
  MarkNotificationsAsReadResponseSuccess: MarkNotificationsAsReadResponseSuccess;
  MediaSet: MediaSet;
  MerchantOnboardingStatusCapabilities: MerchantOnboardingStatusCapabilities;
  MerchantOnboardingStatusSummary: MerchantOnboardingStatusSummary;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ModifyProfileResponse'];
  ModifyProfileResponseSuccess: ModifyProfileResponseSuccess;
  ModifyStoryInput: ModifyStoryInput;
  ModifyStoryResponse: ResolversUnionTypes<ResolversParentTypes>['ModifyStoryResponse'];
  ModifyStoryResponseSuccess: ModifyStoryResponseSuccess;
  Mutation: {};
  NotificationGql: NotificationGql;
  Ping: Ping;
  PushConfig: PushConfig;
  PushToken: Scalars['PushToken']['output'];
  Query: {};
  RecallTransactionInput: RecallTransactionInput;
  RecallTransactionResponse: ResolversUnionTypes<ResolversParentTypes>['RecallTransactionResponse'];
  RecallTransactionResponseSuccess: RecallTransactionResponseSuccess;
  RequestMerchantOnboardingResponse: ResolversUnionTypes<ResolversParentTypes>['RequestMerchantOnboardingResponse'];
  RequestMerchantOnboardingResponseSuccess: RequestMerchantOnboardingResponseSuccess;
  ResponseError: ResponseError;
  RevokePushTokensResponse: ResolversUnionTypes<ResolversParentTypes>['RevokePushTokensResponse'];
  RevokePushTokensResponseSuccess: RevokePushTokensResponseSuccess;
  SavePaymentMethodInput: SavePaymentMethodInput;
  SavePaymentMethodResponse: ResolversUnionTypes<ResolversParentTypes>['SavePaymentMethodResponse'];
  SavePaymentMethodResponseSuccess: SavePaymentMethodResponseSuccess;
  SendBirdInternalUserID: Scalars['SendBirdInternalUserID']['output'];
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolversUnionTypes<ResolversParentTypes>['SendFriendRequestResponse'];
  SendFriendRequestResponseSuccess: SendFriendRequestResponseSuccess;
  SendTransferInput: SendTransferInput;
  SendTransferResponse: ResolversUnionTypes<ResolversParentTypes>['SendTransferResponse'];
  SendTransferResponseSuccess: SendTransferResponseSuccess;
  Status: Status;
  Story: Story;
  StoryAttachment: StoryAttachment;
  StoryAuthor: StoryAuthor;
  StoryMediaAttachmentInput: StoryMediaAttachmentInput;
  String: Scalars['String']['output'];
  Subscription: {};
  SwipeStory: SwipeStory;
  TopUpWalletInput: TopUpWalletInput;
  TopUpWalletResponse: ResolversUnionTypes<ResolversParentTypes>['TopUpWalletResponse'];
  TopUpWalletResponseSuccess: TopUpWalletResponseSuccess;
  UpdateChatSettingsInput: UpdateChatSettingsInput;
  UpdateChatSettingsResponse: ResolversUnionTypes<ResolversParentTypes>['UpdateChatSettingsResponse'];
  UpdateChatSettingsResponseSuccess: UpdateChatSettingsResponseSuccess;
  UpdatePushTokenInput: UpdatePushTokenInput;
  UpdatePushTokenResponse: ResolversUnionTypes<ResolversParentTypes>['UpdatePushTokenResponse'];
  UpdatePushTokenResponseSuccess: UpdatePushTokenResponseSuccess;
  UpdateWishInput: UpdateWishInput;
  UpdateWishResponse: ResolversUnionTypes<ResolversParentTypes>['UpdateWishResponse'];
  UpdateWishResponseSuccess: UpdateWishResponseSuccess;
  User: User;
  UserID: Scalars['UserID']['output'];
  ViewPublicProfileInput: ViewPublicProfileInput;
  ViewPublicProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ViewPublicProfileResponse'];
  ViewPublicProfileResponseSuccess: ViewPublicProfileResponseSuccess;
  WalletAliasID: Scalars['WalletAliasID']['output'];
  Wish: Wish;
  WishAuthor: WishAuthor;
  WishSuggest: WishSuggest;
};

export type CancelSubscriptionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelSubscriptionResponse'] = ResolversParentTypes['CancelSubscriptionResponse']> = {
  __resolveType: TypeResolveFn<'CancelSubscriptionResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CancelSubscriptionResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelSubscriptionResponseSuccess'] = ResolversParentTypes['CancelSubscriptionResponseSuccess']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatRoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatRoom'] = ResolversParentTypes['ChatRoom']> = {
  chatRoomID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['UserID']>, ParentType, ContextType>;
  pushConfig?: Resolver<Maybe<ResolversTypes['PushConfig']>, ParentType, ContextType>;
  sendBirdChannelURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sendBirdParticipants?: Resolver<Array<ResolversTypes['UserID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckMerchantStatusResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckMerchantStatusResponse'] = ResolversParentTypes['CheckMerchantStatusResponse']> = {
  __resolveType: TypeResolveFn<'CheckMerchantStatusResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CheckMerchantStatusResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckMerchantStatusResponseSuccess'] = ResolversParentTypes['CheckMerchantStatusResponseSuccess']> = {
  summary?: Resolver<ResolversTypes['MerchantOnboardingStatusSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckUsernameAvailableResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckUsernameAvailableResponse'] = ResolversParentTypes['CheckUsernameAvailableResponse']> = {
  __resolveType: TypeResolveFn<'CheckUsernameAvailableResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CheckUsernameAvailableResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckUsernameAvailableResponseSuccess'] = ResolversParentTypes['CheckUsernameAvailableResponseSuccess']> = {
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  friendID?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['FriendshipStatus']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePaymentIntentResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePaymentIntentResponse'] = ResolversParentTypes['CreatePaymentIntentResponse']> = {
  __resolveType: TypeResolveFn<'CreatePaymentIntentResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CreatePaymentIntentResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePaymentIntentResponseSuccess'] = ResolversParentTypes['CreatePaymentIntentResponseSuccess']> = {
  checkoutToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purchaseManifestID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateSetupIntentResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateSetupIntentResponse'] = ResolversParentTypes['CreateSetupIntentResponse']> = {
  __resolveType: TypeResolveFn<'CreateSetupIntentResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CreateSetupIntentResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateSetupIntentResponseSuccess'] = ResolversParentTypes['CreateSetupIntentResponseSuccess']> = {
  clientSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateStoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStoryResponse'] = ResolversParentTypes['CreateStoryResponse']> = {
  __resolveType: TypeResolveFn<'CreateStoryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CreateStoryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStoryResponseSuccess'] = ResolversParentTypes['CreateStoryResponseSuccess']> = {
  story?: Resolver<ResolversTypes['Story'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateWishResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWishResponse'] = ResolversParentTypes['CreateWishResponse']> = {
  __resolveType: TypeResolveFn<'CreateWishResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CreateWishResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWishResponseSuccess'] = ResolversParentTypes['CreateWishResponseSuccess']> = {
  wish?: Resolver<ResolversTypes['Wish'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateString'], any> {
  name: 'DateString';
}

export type DemoMutatedItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoMutatedItem'] = ResolversParentTypes['DemoMutatedItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DemoMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoMutationResponse'] = ResolversParentTypes['DemoMutationResponse']> = {
  __resolveType: TypeResolveFn<'DemoMutationResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type DemoMutationResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoMutationResponseSuccess'] = ResolversParentTypes['DemoMutationResponseSuccess']> = {
  item?: Resolver<ResolversTypes['DemoMutatedItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DemoQueryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoQueryResponse'] = ResolversParentTypes['DemoQueryResponse']> = {
  __resolveType: TypeResolveFn<'DemoQueryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type DemoQueryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoQueryResponseSuccess'] = ResolversParentTypes['DemoQueryResponseSuccess']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DemoSubscriptionEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoSubscriptionEvent'] = ResolversParentTypes['DemoSubscriptionEvent']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnterChatRoomResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnterChatRoomResponse'] = ResolversParentTypes['EnterChatRoomResponse']> = {
  __resolveType: TypeResolveFn<'EnterChatRoomResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type EnterChatRoomResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnterChatRoomResponseSuccess'] = ResolversParentTypes['EnterChatRoomResponseSuccess']> = {
  chatRoom?: Resolver<ResolversTypes['ChatRoom'], ParentType, ContextType>;
  isNew?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FetchRecentNotificationsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchRecentNotificationsResponse'] = ResolversParentTypes['FetchRecentNotificationsResponse']> = {
  __resolveType: TypeResolveFn<'FetchRecentNotificationsResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type FetchRecentNotificationsResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchRecentNotificationsResponseSuccess'] = ResolversParentTypes['FetchRecentNotificationsResponseSuccess']> = {
  notifications?: Resolver<Array<ResolversTypes['NotificationGql']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FetchStoryFeedResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchStoryFeedResponse'] = ResolversParentTypes['FetchStoryFeedResponse']> = {
  __resolveType: TypeResolveFn<'FetchStoryFeedResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type FetchStoryFeedResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchStoryFeedResponseSuccess'] = ResolversParentTypes['FetchStoryFeedResponseSuccess']> = {
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FetchSwipeFeedResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchSwipeFeedResponse'] = ResolversParentTypes['FetchSwipeFeedResponse']> = {
  __resolveType: TypeResolveFn<'FetchSwipeFeedResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type FetchSwipeFeedResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['FetchSwipeFeedResponseSuccess'] = ResolversParentTypes['FetchSwipeFeedResponseSuccess']> = {
  swipeStack?: Resolver<Array<ResolversTypes['SwipeStory']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetMyProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetMyProfileResponse'] = ResolversParentTypes['GetMyProfileResponse']> = {
  __resolveType: TypeResolveFn<'GetMyProfileResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type GetMyProfileResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetMyProfileResponseSuccess'] = ResolversParentTypes['GetMyProfileResponseSuccess']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetStoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetStoryResponse'] = ResolversParentTypes['GetStoryResponse']> = {
  __resolveType: TypeResolveFn<'GetStoryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type GetStoryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetStoryResponseSuccess'] = ResolversParentTypes['GetStoryResponseSuccess']> = {
  story?: Resolver<ResolversTypes['Story'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetWishResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetWishResponse'] = ResolversParentTypes['GetWishResponse']> = {
  __resolveType: TypeResolveFn<'GetWishResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type GetWishResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetWishResponseSuccess'] = ResolversParentTypes['GetWishResponseSuccess']> = {
  wish?: Resolver<ResolversTypes['Wish'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GroupChatIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GroupChatID'], any> {
  name: 'GroupChatID';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

export type InteractStoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['InteractStoryResponse'] = ResolversParentTypes['InteractStoryResponse']> = {
  __resolveType: TypeResolveFn<'InteractStoryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type InteractStoryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['InteractStoryResponseSuccess'] = ResolversParentTypes['InteractStoryResponseSuccess']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListChatRoomsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListChatRoomsResponse'] = ResolversParentTypes['ListChatRoomsResponse']> = {
  __resolveType: TypeResolveFn<'ListChatRoomsResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ListChatRoomsResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListChatRoomsResponseSuccess'] = ResolversParentTypes['ListChatRoomsResponseSuccess']> = {
  chatRooms?: Resolver<Array<ResolversTypes['ChatRoom']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListContactsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListContactsResponse'] = ResolversParentTypes['ListContactsResponse']> = {
  __resolveType: TypeResolveFn<'ListContactsResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ListContactsResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListContactsResponseSuccess'] = ResolversParentTypes['ListContactsResponseSuccess']> = {
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListWishlistResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListWishlistResponse'] = ResolversParentTypes['ListWishlistResponse']> = {
  __resolveType: TypeResolveFn<'ListWishlistResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ListWishlistResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListWishlistResponseSuccess'] = ResolversParentTypes['ListWishlistResponseSuccess']> = {
  wishlist?: Resolver<Array<ResolversTypes['Wish']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ManageFriendshipResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManageFriendshipResponse'] = ResolversParentTypes['ManageFriendshipResponse']> = {
  __resolveType: TypeResolveFn<'ManageFriendshipResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ManageFriendshipResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManageFriendshipResponseSuccess'] = ResolversParentTypes['ManageFriendshipResponseSuccess']> = {
  status?: Resolver<ResolversTypes['FriendshipStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkNotificationsAsReadResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkNotificationsAsReadResponse'] = ResolversParentTypes['MarkNotificationsAsReadResponse']> = {
  __resolveType: TypeResolveFn<'MarkNotificationsAsReadResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type MarkNotificationsAsReadResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkNotificationsAsReadResponseSuccess'] = ResolversParentTypes['MarkNotificationsAsReadResponseSuccess']> = {
  notifications?: Resolver<Array<ResolversTypes['NotificationGql']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaSetResolvers<ContextType = any, ParentType extends ResolversParentTypes['MediaSet'] = ResolversParentTypes['MediaSet']> = {
  large?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  medium?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  small?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MerchantOnboardingStatusCapabilitiesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MerchantOnboardingStatusCapabilities'] = ResolversParentTypes['MerchantOnboardingStatusCapabilities']> = {
  card_payments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  charges_enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  payouts_enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  transfers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MerchantOnboardingStatusSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['MerchantOnboardingStatusSummary'] = ResolversParentTypes['MerchantOnboardingStatusSummary']> = {
  anythingDue?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  anythingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  capabilities?: Resolver<ResolversTypes['MerchantOnboardingStatusCapabilities'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  escrowWallet?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hasMerchantPrivilege?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stripeMerchantID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  stripePortalUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tradingWallet?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModifyProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyProfileResponse'] = ResolversParentTypes['ModifyProfileResponse']> = {
  __resolveType: TypeResolveFn<'ModifyProfileResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ModifyProfileResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyProfileResponseSuccess'] = ResolversParentTypes['ModifyProfileResponseSuccess']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModifyStoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyStoryResponse'] = ResolversParentTypes['ModifyStoryResponse']> = {
  __resolveType: TypeResolveFn<'ModifyStoryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ModifyStoryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyStoryResponseSuccess'] = ResolversParentTypes['ModifyStoryResponseSuccess']> = {
  story?: Resolver<ResolversTypes['Story'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelSubscription?: Resolver<ResolversTypes['CancelSubscriptionResponse'], ParentType, ContextType, RequireFields<MutationCancelSubscriptionArgs, 'input'>>;
  createPaymentIntent?: Resolver<ResolversTypes['CreatePaymentIntentResponse'], ParentType, ContextType, RequireFields<MutationCreatePaymentIntentArgs, 'input'>>;
  createSetupIntent?: Resolver<ResolversTypes['CreateSetupIntentResponse'], ParentType, ContextType>;
  createStory?: Resolver<ResolversTypes['CreateStoryResponse'], ParentType, ContextType, RequireFields<MutationCreateStoryArgs, 'input'>>;
  createWish?: Resolver<ResolversTypes['CreateWishResponse'], ParentType, ContextType, RequireFields<MutationCreateWishArgs, 'input'>>;
  demoMutation?: Resolver<ResolversTypes['DemoMutationResponse'], ParentType, ContextType, RequireFields<MutationDemoMutationArgs, 'input'>>;
  interactStory?: Resolver<ResolversTypes['InteractStoryResponse'], ParentType, ContextType, RequireFields<MutationInteractStoryArgs, 'input'>>;
  manageFriendship?: Resolver<ResolversTypes['ManageFriendshipResponse'], ParentType, ContextType, RequireFields<MutationManageFriendshipArgs, 'input'>>;
  markNotificationsAsRead?: Resolver<ResolversTypes['MarkNotificationsAsReadResponse'], ParentType, ContextType, RequireFields<MutationMarkNotificationsAsReadArgs, 'input'>>;
  modifyProfile?: Resolver<ResolversTypes['ModifyProfileResponse'], ParentType, ContextType, RequireFields<MutationModifyProfileArgs, 'input'>>;
  modifyStory?: Resolver<ResolversTypes['ModifyStoryResponse'], ParentType, ContextType, RequireFields<MutationModifyStoryArgs, 'input'>>;
  recallTransaction?: Resolver<ResolversTypes['RecallTransactionResponse'], ParentType, ContextType, RequireFields<MutationRecallTransactionArgs, 'input'>>;
  requestMerchantOnboarding?: Resolver<ResolversTypes['RequestMerchantOnboardingResponse'], ParentType, ContextType>;
  revokePushTokens?: Resolver<ResolversTypes['RevokePushTokensResponse'], ParentType, ContextType>;
  savePaymentMethod?: Resolver<ResolversTypes['SavePaymentMethodResponse'], ParentType, ContextType, RequireFields<MutationSavePaymentMethodArgs, 'input'>>;
  sendFriendRequest?: Resolver<ResolversTypes['SendFriendRequestResponse'], ParentType, ContextType, RequireFields<MutationSendFriendRequestArgs, 'input'>>;
  sendTransfer?: Resolver<ResolversTypes['SendTransferResponse'], ParentType, ContextType, RequireFields<MutationSendTransferArgs, 'input'>>;
  topUpWallet?: Resolver<ResolversTypes['TopUpWalletResponse'], ParentType, ContextType, RequireFields<MutationTopUpWalletArgs, 'input'>>;
  updateChatSettings?: Resolver<ResolversTypes['UpdateChatSettingsResponse'], ParentType, ContextType, RequireFields<MutationUpdateChatSettingsArgs, 'input'>>;
  updatePushToken?: Resolver<ResolversTypes['UpdatePushTokenResponse'], ParentType, ContextType, RequireFields<MutationUpdatePushTokenArgs, 'input'>>;
  updateWish?: Resolver<ResolversTypes['UpdateWishResponse'], ParentType, ContextType, RequireFields<MutationUpdateWishArgs, 'input'>>;
};

export type NotificationGqlResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationGql'] = ResolversParentTypes['NotificationGql']> = {
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  markedRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  relatedChatRoomID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  route?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ping'] = ResolversParentTypes['Ping']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PushConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['PushConfig'] = ResolversParentTypes['PushConfig']> = {
  allowPush?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  snoozeUntil?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PushTokenScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PushToken'], any> {
  name: 'PushToken';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkMerchantStatus?: Resolver<ResolversTypes['CheckMerchantStatusResponse'], ParentType, ContextType, RequireFields<QueryCheckMerchantStatusArgs, 'input'>>;
  checkUsernameAvailable?: Resolver<ResolversTypes['CheckUsernameAvailableResponse'], ParentType, ContextType, RequireFields<QueryCheckUsernameAvailableArgs, 'input'>>;
  demoPing?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  demoQuery?: Resolver<ResolversTypes['DemoQueryResponse'], ParentType, ContextType, RequireFields<QueryDemoQueryArgs, 'input'>>;
  enterChatRoom?: Resolver<ResolversTypes['EnterChatRoomResponse'], ParentType, ContextType, RequireFields<QueryEnterChatRoomArgs, 'input'>>;
  fetchRecentNotifications?: Resolver<ResolversTypes['FetchRecentNotificationsResponse'], ParentType, ContextType, RequireFields<QueryFetchRecentNotificationsArgs, 'input'>>;
  fetchStoryFeed?: Resolver<ResolversTypes['FetchStoryFeedResponse'], ParentType, ContextType, RequireFields<QueryFetchStoryFeedArgs, 'input'>>;
  fetchSwipeFeed?: Resolver<ResolversTypes['FetchSwipeFeedResponse'], ParentType, ContextType, RequireFields<QueryFetchSwipeFeedArgs, 'input'>>;
  getMyProfile?: Resolver<ResolversTypes['GetMyProfileResponse'], ParentType, ContextType>;
  getStory?: Resolver<ResolversTypes['GetStoryResponse'], ParentType, ContextType, RequireFields<QueryGetStoryArgs, 'input'>>;
  getWish?: Resolver<ResolversTypes['GetWishResponse'], ParentType, ContextType, RequireFields<QueryGetWishArgs, 'input'>>;
  listChatRooms?: Resolver<ResolversTypes['ListChatRoomsResponse'], ParentType, ContextType>;
  listContacts?: Resolver<ResolversTypes['ListContactsResponse'], ParentType, ContextType, RequireFields<QueryListContactsArgs, 'input'>>;
  listWishlist?: Resolver<ResolversTypes['ListWishlistResponse'], ParentType, ContextType, RequireFields<QueryListWishlistArgs, 'input'>>;
  ping?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  viewPublicProfile?: Resolver<ResolversTypes['ViewPublicProfileResponse'], ParentType, ContextType, RequireFields<QueryViewPublicProfileArgs, 'input'>>;
};

export type RecallTransactionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecallTransactionResponse'] = ResolversParentTypes['RecallTransactionResponse']> = {
  __resolveType: TypeResolveFn<'RecallTransactionResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type RecallTransactionResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecallTransactionResponseSuccess'] = ResolversParentTypes['RecallTransactionResponseSuccess']> = {
  referenceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestMerchantOnboardingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestMerchantOnboardingResponse'] = ResolversParentTypes['RequestMerchantOnboardingResponse']> = {
  __resolveType: TypeResolveFn<'RequestMerchantOnboardingResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type RequestMerchantOnboardingResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestMerchantOnboardingResponseSuccess'] = ResolversParentTypes['RequestMerchantOnboardingResponseSuccess']> = {
  registrationUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseError'] = ResolversParentTypes['ResponseError']> = {
  error?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RevokePushTokensResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RevokePushTokensResponse'] = ResolversParentTypes['RevokePushTokensResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'RevokePushTokensResponseSuccess', ParentType, ContextType>;
};

export type RevokePushTokensResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['RevokePushTokensResponseSuccess'] = ResolversParentTypes['RevokePushTokensResponseSuccess']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SavePaymentMethodResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SavePaymentMethodResponse'] = ResolversParentTypes['SavePaymentMethodResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'SavePaymentMethodResponseSuccess', ParentType, ContextType>;
};

export type SavePaymentMethodResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['SavePaymentMethodResponseSuccess'] = ResolversParentTypes['SavePaymentMethodResponseSuccess']> = {
  paymentMethodID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface SendBirdInternalUserIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SendBirdInternalUserID'], any> {
  name: 'SendBirdInternalUserID';
}

export type SendFriendRequestResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendFriendRequestResponse'] = ResolversParentTypes['SendFriendRequestResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'SendFriendRequestResponseSuccess', ParentType, ContextType>;
};

export type SendFriendRequestResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendFriendRequestResponseSuccess'] = ResolversParentTypes['SendFriendRequestResponseSuccess']> = {
  status?: Resolver<ResolversTypes['FriendshipStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendTransferResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendTransferResponse'] = ResolversParentTypes['SendTransferResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'SendTransferResponseSuccess', ParentType, ContextType>;
};

export type SendTransferResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendTransferResponseSuccess'] = ResolversParentTypes['SendTransferResponseSuccess']> = {
  referenceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  code?: Resolver<ResolversTypes['StatusCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Story'] = ResolversParentTypes['Story']> = {
  attachments?: Resolver<Array<ResolversTypes['StoryAttachment']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['StoryAuthor'], ParentType, ContextType>;
  caption?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  linkedWishID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  outboundLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pinned?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showcase?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showcaseThumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userID?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoryAttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoryAttachment'] = ResolversParentTypes['StoryAttachment']> = {
  altText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stream?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StoryAttachmentType'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userID?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoryAuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoryAuthor'] = ResolversParentTypes['StoryAuthor']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  demoSubscription?: SubscriptionResolver<ResolversTypes['DemoSubscriptionEvent'], "demoSubscription", ParentType, ContextType>;
};

export type SwipeStoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwipeStory'] = ResolversParentTypes['SwipeStory']> = {
  story?: Resolver<ResolversTypes['Story'], ParentType, ContextType>;
  wish?: Resolver<Maybe<ResolversTypes['Wish']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopUpWalletResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopUpWalletResponse'] = ResolversParentTypes['TopUpWalletResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'TopUpWalletResponseSuccess', ParentType, ContextType>;
};

export type TopUpWalletResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopUpWalletResponseSuccess'] = ResolversParentTypes['TopUpWalletResponseSuccess']> = {
  checkoutToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purchaseManifestID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateChatSettingsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateChatSettingsResponse'] = ResolversParentTypes['UpdateChatSettingsResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'UpdateChatSettingsResponseSuccess', ParentType, ContextType>;
};

export type UpdateChatSettingsResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateChatSettingsResponseSuccess'] = ResolversParentTypes['UpdateChatSettingsResponseSuccess']> = {
  chatRoom?: Resolver<ResolversTypes['ChatRoom'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatePushTokenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePushTokenResponse'] = ResolversParentTypes['UpdatePushTokenResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'UpdatePushTokenResponseSuccess', ParentType, ContextType>;
};

export type UpdatePushTokenResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePushTokenResponseSuccess'] = ResolversParentTypes['UpdatePushTokenResponseSuccess']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateWishResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateWishResponse'] = ResolversParentTypes['UpdateWishResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'UpdateWishResponseSuccess', ParentType, ContextType>;
};

export type UpdateWishResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateWishResponseSuccess'] = ResolversParentTypes['UpdateWishResponseSuccess']> = {
  wish?: Resolver<ResolversTypes['Wish'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  defaultPaymentMethodID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  escrowWallet?: Resolver<Maybe<ResolversTypes['WalletAliasID']>, ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['GenderEnum'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  interestedIn?: Resolver<Array<ResolversTypes['GenderEnum']>, ParentType, ContextType>;
  isCreator?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPaidChat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['LanguageEnum'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privacyMode?: Resolver<ResolversTypes['PrivacyModeEnum'], ParentType, ContextType>;
  sendBirdAccessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>;
  themeColor?: Resolver<ResolversTypes['HexColorCode'], ParentType, ContextType>;
  tradingWallet?: Resolver<Maybe<ResolversTypes['WalletAliasID']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UserIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UserID'], any> {
  name: 'UserID';
}

export type ViewPublicProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ViewPublicProfileResponse'] = ResolversParentTypes['ViewPublicProfileResponse']> = {
  __resolveType: TypeResolveFn<'ResponseError' | 'ViewPublicProfileResponseSuccess', ParentType, ContextType>;
};

export type ViewPublicProfileResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ViewPublicProfileResponseSuccess'] = ResolversParentTypes['ViewPublicProfileResponseSuccess']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  privacyMode?: Resolver<ResolversTypes['PrivacyModeEnum'], ParentType, ContextType>;
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface WalletAliasIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['WalletAliasID'], any> {
  name: 'WalletAliasID';
}

export type WishResolvers<ContextType = any, ParentType extends ResolversParentTypes['Wish'] = ResolversParentTypes['Wish']> = {
  author?: Resolver<Maybe<ResolversTypes['WishAuthor']>, ParentType, ContextType>;
  buyFrequency?: Resolver<ResolversTypes['WishBuyFrequency'], ParentType, ContextType>;
  cookiePrice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  countdownDate?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  creatorID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  galleryMediaSet?: Resolver<Array<ResolversTypes['MediaSet']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  stickerMediaSet?: Resolver<ResolversTypes['MediaSet'], ParentType, ContextType>;
  stickerTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['WishlistVisibility'], ParentType, ContextType>;
  wishTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wishType?: Resolver<ResolversTypes['WishTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WishAuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['WishAuthor'] = ResolversParentTypes['WishAuthor']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CancelSubscriptionResponse?: CancelSubscriptionResponseResolvers<ContextType>;
  CancelSubscriptionResponseSuccess?: CancelSubscriptionResponseSuccessResolvers<ContextType>;
  ChatRoom?: ChatRoomResolvers<ContextType>;
  CheckMerchantStatusResponse?: CheckMerchantStatusResponseResolvers<ContextType>;
  CheckMerchantStatusResponseSuccess?: CheckMerchantStatusResponseSuccessResolvers<ContextType>;
  CheckUsernameAvailableResponse?: CheckUsernameAvailableResponseResolvers<ContextType>;
  CheckUsernameAvailableResponseSuccess?: CheckUsernameAvailableResponseSuccessResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  CreatePaymentIntentResponse?: CreatePaymentIntentResponseResolvers<ContextType>;
  CreatePaymentIntentResponseSuccess?: CreatePaymentIntentResponseSuccessResolvers<ContextType>;
  CreateSetupIntentResponse?: CreateSetupIntentResponseResolvers<ContextType>;
  CreateSetupIntentResponseSuccess?: CreateSetupIntentResponseSuccessResolvers<ContextType>;
  CreateStoryResponse?: CreateStoryResponseResolvers<ContextType>;
  CreateStoryResponseSuccess?: CreateStoryResponseSuccessResolvers<ContextType>;
  CreateWishResponse?: CreateWishResponseResolvers<ContextType>;
  CreateWishResponseSuccess?: CreateWishResponseSuccessResolvers<ContextType>;
  DateString?: GraphQLScalarType;
  DemoMutatedItem?: DemoMutatedItemResolvers<ContextType>;
  DemoMutationResponse?: DemoMutationResponseResolvers<ContextType>;
  DemoMutationResponseSuccess?: DemoMutationResponseSuccessResolvers<ContextType>;
  DemoQueryResponse?: DemoQueryResponseResolvers<ContextType>;
  DemoQueryResponseSuccess?: DemoQueryResponseSuccessResolvers<ContextType>;
  DemoSubscriptionEvent?: DemoSubscriptionEventResolvers<ContextType>;
  EnterChatRoomResponse?: EnterChatRoomResponseResolvers<ContextType>;
  EnterChatRoomResponseSuccess?: EnterChatRoomResponseSuccessResolvers<ContextType>;
  FetchRecentNotificationsResponse?: FetchRecentNotificationsResponseResolvers<ContextType>;
  FetchRecentNotificationsResponseSuccess?: FetchRecentNotificationsResponseSuccessResolvers<ContextType>;
  FetchStoryFeedResponse?: FetchStoryFeedResponseResolvers<ContextType>;
  FetchStoryFeedResponseSuccess?: FetchStoryFeedResponseSuccessResolvers<ContextType>;
  FetchSwipeFeedResponse?: FetchSwipeFeedResponseResolvers<ContextType>;
  FetchSwipeFeedResponseSuccess?: FetchSwipeFeedResponseSuccessResolvers<ContextType>;
  GetMyProfileResponse?: GetMyProfileResponseResolvers<ContextType>;
  GetMyProfileResponseSuccess?: GetMyProfileResponseSuccessResolvers<ContextType>;
  GetStoryResponse?: GetStoryResponseResolvers<ContextType>;
  GetStoryResponseSuccess?: GetStoryResponseSuccessResolvers<ContextType>;
  GetWishResponse?: GetWishResponseResolvers<ContextType>;
  GetWishResponseSuccess?: GetWishResponseSuccessResolvers<ContextType>;
  GroupChatID?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  InteractStoryResponse?: InteractStoryResponseResolvers<ContextType>;
  InteractStoryResponseSuccess?: InteractStoryResponseSuccessResolvers<ContextType>;
  ListChatRoomsResponse?: ListChatRoomsResponseResolvers<ContextType>;
  ListChatRoomsResponseSuccess?: ListChatRoomsResponseSuccessResolvers<ContextType>;
  ListContactsResponse?: ListContactsResponseResolvers<ContextType>;
  ListContactsResponseSuccess?: ListContactsResponseSuccessResolvers<ContextType>;
  ListWishlistResponse?: ListWishlistResponseResolvers<ContextType>;
  ListWishlistResponseSuccess?: ListWishlistResponseSuccessResolvers<ContextType>;
  ManageFriendshipResponse?: ManageFriendshipResponseResolvers<ContextType>;
  ManageFriendshipResponseSuccess?: ManageFriendshipResponseSuccessResolvers<ContextType>;
  MarkNotificationsAsReadResponse?: MarkNotificationsAsReadResponseResolvers<ContextType>;
  MarkNotificationsAsReadResponseSuccess?: MarkNotificationsAsReadResponseSuccessResolvers<ContextType>;
  MediaSet?: MediaSetResolvers<ContextType>;
  MerchantOnboardingStatusCapabilities?: MerchantOnboardingStatusCapabilitiesResolvers<ContextType>;
  MerchantOnboardingStatusSummary?: MerchantOnboardingStatusSummaryResolvers<ContextType>;
  ModifyProfileResponse?: ModifyProfileResponseResolvers<ContextType>;
  ModifyProfileResponseSuccess?: ModifyProfileResponseSuccessResolvers<ContextType>;
  ModifyStoryResponse?: ModifyStoryResponseResolvers<ContextType>;
  ModifyStoryResponseSuccess?: ModifyStoryResponseSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotificationGql?: NotificationGqlResolvers<ContextType>;
  Ping?: PingResolvers<ContextType>;
  PushConfig?: PushConfigResolvers<ContextType>;
  PushToken?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RecallTransactionResponse?: RecallTransactionResponseResolvers<ContextType>;
  RecallTransactionResponseSuccess?: RecallTransactionResponseSuccessResolvers<ContextType>;
  RequestMerchantOnboardingResponse?: RequestMerchantOnboardingResponseResolvers<ContextType>;
  RequestMerchantOnboardingResponseSuccess?: RequestMerchantOnboardingResponseSuccessResolvers<ContextType>;
  ResponseError?: ResponseErrorResolvers<ContextType>;
  RevokePushTokensResponse?: RevokePushTokensResponseResolvers<ContextType>;
  RevokePushTokensResponseSuccess?: RevokePushTokensResponseSuccessResolvers<ContextType>;
  SavePaymentMethodResponse?: SavePaymentMethodResponseResolvers<ContextType>;
  SavePaymentMethodResponseSuccess?: SavePaymentMethodResponseSuccessResolvers<ContextType>;
  SendBirdInternalUserID?: GraphQLScalarType;
  SendFriendRequestResponse?: SendFriendRequestResponseResolvers<ContextType>;
  SendFriendRequestResponseSuccess?: SendFriendRequestResponseSuccessResolvers<ContextType>;
  SendTransferResponse?: SendTransferResponseResolvers<ContextType>;
  SendTransferResponseSuccess?: SendTransferResponseSuccessResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Story?: StoryResolvers<ContextType>;
  StoryAttachment?: StoryAttachmentResolvers<ContextType>;
  StoryAuthor?: StoryAuthorResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SwipeStory?: SwipeStoryResolvers<ContextType>;
  TopUpWalletResponse?: TopUpWalletResponseResolvers<ContextType>;
  TopUpWalletResponseSuccess?: TopUpWalletResponseSuccessResolvers<ContextType>;
  UpdateChatSettingsResponse?: UpdateChatSettingsResponseResolvers<ContextType>;
  UpdateChatSettingsResponseSuccess?: UpdateChatSettingsResponseSuccessResolvers<ContextType>;
  UpdatePushTokenResponse?: UpdatePushTokenResponseResolvers<ContextType>;
  UpdatePushTokenResponseSuccess?: UpdatePushTokenResponseSuccessResolvers<ContextType>;
  UpdateWishResponse?: UpdateWishResponseResolvers<ContextType>;
  UpdateWishResponseSuccess?: UpdateWishResponseSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserID?: GraphQLScalarType;
  ViewPublicProfileResponse?: ViewPublicProfileResponseResolvers<ContextType>;
  ViewPublicProfileResponseSuccess?: ViewPublicProfileResponseSuccessResolvers<ContextType>;
  WalletAliasID?: GraphQLScalarType;
  Wish?: WishResolvers<ContextType>;
  WishAuthor?: WishAuthorResolvers<ContextType>;
};

