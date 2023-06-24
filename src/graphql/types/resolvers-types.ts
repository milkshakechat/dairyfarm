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
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  chatRoomID: Scalars['String']['output'];
  participants: Array<Scalars['UserID']['output']>;
  pushConfig?: Maybe<PushConfig>;
  sendBirdChannelURL?: Maybe<Scalars['String']['output']>;
  sendBirdParticipants: Array<Scalars['UserID']['output']>;
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

export type CreateStoryInput = {
  caption: Scalars['String']['input'];
  media?: InputMaybe<StoryMediaAttachmentInput>;
};

export type CreateStoryResponse = CreateStoryResponseSuccess | ResponseError;

export type CreateStoryResponseSuccess = {
  __typename?: 'CreateStoryResponseSuccess';
  story: Story;
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
  Blocked = 'BLOCKED',
  Declined = 'DECLINED',
  GotRequest = 'GOT_REQUEST',
  None = 'NONE',
  SentRequest = 'SENT_REQUEST'
}

export type GetMyProfileResponse = GetMyProfileResponseSuccess | ResponseError;

export type GetMyProfileResponseSuccess = {
  __typename?: 'GetMyProfileResponseSuccess';
  user: User;
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

export type ListContactsResponse = ListContactsResponseSuccess | ResponseError;

export type ListContactsResponseSuccess = {
  __typename?: 'ListContactsResponseSuccess';
  contacts: Array<Contact>;
  globalDirectory: Array<Contact>;
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

export type ModifyProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  createStory: CreateStoryResponse;
  demoMutation: DemoMutationResponse;
  manageFriendship: ManageFriendshipResponse;
  modifyProfile: ModifyProfileResponse;
  sendFriendRequest: SendFriendRequestResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updatePushToken: UpdatePushTokenResponse;
};


export type MutationCreateStoryArgs = {
  input: CreateStoryInput;
};


export type MutationDemoMutationArgs = {
  input: DemoMutationInput;
};


export type MutationManageFriendshipArgs = {
  input: ManageFriendshipInput;
};


export type MutationModifyProfileArgs = {
  input: ModifyProfileInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type MutationUpdateChatSettingsArgs = {
  input: UpdateChatSettingsInput;
};


export type MutationUpdatePushTokenArgs = {
  input: UpdatePushTokenInput;
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
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  enterChatRoom: EnterChatRoomResponse;
  getMyProfile: GetMyProfileResponse;
  listChatRooms: ListChatRoomsResponse;
  listContacts: ListContactsResponse;
  ping: Ping;
  viewPublicProfile: ViewPublicProfileResponse;
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


export type QueryViewPublicProfileArgs = {
  input: ViewPublicProfileInput;
};

export type ResponseError = {
  __typename?: 'ResponseError';
  error: Status;
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
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateString']['output']>;
  expiresAt?: Maybe<Scalars['DateString']['output']>;
  id: Scalars['ID']['output'];
  outboundLink?: Maybe<Scalars['String']['output']>;
  pinned?: Maybe<Scalars['Boolean']['output']>;
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

export type StoryMediaAttachmentInput = {
  type: StoryAttachmentType;
  url: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
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

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  bio: Scalars['String']['output'];
  createdAt: Scalars['DateString']['output'];
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  isCreator: Scalars['Boolean']['output'];
  isPaidChat: Scalars['Boolean']['output'];
  language: LanguageEnum;
  link: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  privacyMode: PrivacyModeEnum;
  sendBirdAccessToken?: Maybe<Scalars['String']['output']>;
  themeColor: Scalars['HexColorCode']['output'];
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
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UserID']['output'];
  username: Scalars['String']['output'];
};



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
  CheckUsernameAvailableResponse: ( CheckUsernameAvailableResponseSuccess ) | ( ResponseError );
  CreateStoryResponse: ( CreateStoryResponseSuccess ) | ( ResponseError );
  DemoMutationResponse: ( DemoMutationResponseSuccess ) | ( ResponseError );
  DemoQueryResponse: ( DemoQueryResponseSuccess ) | ( ResponseError );
  EnterChatRoomResponse: ( EnterChatRoomResponseSuccess ) | ( ResponseError );
  GetMyProfileResponse: ( GetMyProfileResponseSuccess ) | ( ResponseError );
  ListChatRoomsResponse: ( ListChatRoomsResponseSuccess ) | ( ResponseError );
  ListContactsResponse: ( ListContactsResponseSuccess ) | ( ResponseError );
  ManageFriendshipResponse: ( ManageFriendshipResponseSuccess ) | ( ResponseError );
  ModifyProfileResponse: ( ModifyProfileResponseSuccess ) | ( ResponseError );
  SendFriendRequestResponse: ( ResponseError ) | ( SendFriendRequestResponseSuccess );
  UpdateChatSettingsResponse: ( ResponseError ) | ( UpdateChatSettingsResponseSuccess );
  UpdatePushTokenResponse: ( ResponseError ) | ( UpdatePushTokenResponseSuccess );
  ViewPublicProfileResponse: ( ResponseError ) | ( ViewPublicProfileResponseSuccess );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChatRoom: ResolverTypeWrapper<ChatRoom>;
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CheckUsernameAvailableResponse']>;
  CheckUsernameAvailableResponseSuccess: ResolverTypeWrapper<CheckUsernameAvailableResponseSuccess>;
  Contact: ResolverTypeWrapper<Contact>;
  CreateStoryInput: CreateStoryInput;
  CreateStoryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateStoryResponse']>;
  CreateStoryResponseSuccess: ResolverTypeWrapper<CreateStoryResponseSuccess>;
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
  FriendshipAction: FriendshipAction;
  FriendshipStatus: FriendshipStatus;
  GetMyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetMyProfileResponse']>;
  GetMyProfileResponseSuccess: ResolverTypeWrapper<GetMyProfileResponseSuccess>;
  GroupChatID: ResolverTypeWrapper<Scalars['GroupChatID']['output']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LanguageEnum: LanguageEnum;
  ListChatRoomsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListChatRoomsResponse']>;
  ListChatRoomsResponseSuccess: ResolverTypeWrapper<ListChatRoomsResponseSuccess>;
  ListContactsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListContactsResponse']>;
  ListContactsResponseSuccess: ResolverTypeWrapper<ListContactsResponseSuccess>;
  ManageFriendshipInput: ManageFriendshipInput;
  ManageFriendshipResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ManageFriendshipResponse']>;
  ManageFriendshipResponseSuccess: ResolverTypeWrapper<ManageFriendshipResponseSuccess>;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ModifyProfileResponse']>;
  ModifyProfileResponseSuccess: ResolverTypeWrapper<ModifyProfileResponseSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  Ping: ResolverTypeWrapper<Ping>;
  PrivacyModeEnum: PrivacyModeEnum;
  PushConfig: ResolverTypeWrapper<PushConfig>;
  PushToken: ResolverTypeWrapper<Scalars['PushToken']['output']>;
  Query: ResolverTypeWrapper<{}>;
  ResponseError: ResolverTypeWrapper<ResponseError>;
  SendBirdInternalUserID: ResolverTypeWrapper<Scalars['SendBirdInternalUserID']['output']>;
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SendFriendRequestResponse']>;
  SendFriendRequestResponseSuccess: ResolverTypeWrapper<SendFriendRequestResponseSuccess>;
  Status: ResolverTypeWrapper<Status>;
  StatusCode: StatusCode;
  Story: ResolverTypeWrapper<Story>;
  StoryAttachment: ResolverTypeWrapper<StoryAttachment>;
  StoryAttachmentType: StoryAttachmentType;
  StoryMediaAttachmentInput: StoryMediaAttachmentInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateChatSettingsInput: UpdateChatSettingsInput;
  UpdateChatSettingsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateChatSettingsResponse']>;
  UpdateChatSettingsResponseSuccess: ResolverTypeWrapper<UpdateChatSettingsResponseSuccess>;
  UpdatePushTokenInput: UpdatePushTokenInput;
  UpdatePushTokenResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdatePushTokenResponse']>;
  UpdatePushTokenResponseSuccess: ResolverTypeWrapper<UpdatePushTokenResponseSuccess>;
  User: ResolverTypeWrapper<User>;
  UserID: ResolverTypeWrapper<Scalars['UserID']['output']>;
  ViewPublicProfileInput: ViewPublicProfileInput;
  ViewPublicProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ViewPublicProfileResponse']>;
  ViewPublicProfileResponseSuccess: ResolverTypeWrapper<ViewPublicProfileResponseSuccess>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ChatRoom: ChatRoom;
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolversUnionTypes<ResolversParentTypes>['CheckUsernameAvailableResponse'];
  CheckUsernameAvailableResponseSuccess: CheckUsernameAvailableResponseSuccess;
  Contact: Contact;
  CreateStoryInput: CreateStoryInput;
  CreateStoryResponse: ResolversUnionTypes<ResolversParentTypes>['CreateStoryResponse'];
  CreateStoryResponseSuccess: CreateStoryResponseSuccess;
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
  GetMyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['GetMyProfileResponse'];
  GetMyProfileResponseSuccess: GetMyProfileResponseSuccess;
  GroupChatID: Scalars['GroupChatID']['output'];
  HexColorCode: Scalars['HexColorCode']['output'];
  ID: Scalars['ID']['output'];
  ListChatRoomsResponse: ResolversUnionTypes<ResolversParentTypes>['ListChatRoomsResponse'];
  ListChatRoomsResponseSuccess: ListChatRoomsResponseSuccess;
  ListContactsResponse: ResolversUnionTypes<ResolversParentTypes>['ListContactsResponse'];
  ListContactsResponseSuccess: ListContactsResponseSuccess;
  ManageFriendshipInput: ManageFriendshipInput;
  ManageFriendshipResponse: ResolversUnionTypes<ResolversParentTypes>['ManageFriendshipResponse'];
  ManageFriendshipResponseSuccess: ManageFriendshipResponseSuccess;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ModifyProfileResponse'];
  ModifyProfileResponseSuccess: ModifyProfileResponseSuccess;
  Mutation: {};
  Ping: Ping;
  PushConfig: PushConfig;
  PushToken: Scalars['PushToken']['output'];
  Query: {};
  ResponseError: ResponseError;
  SendBirdInternalUserID: Scalars['SendBirdInternalUserID']['output'];
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolversUnionTypes<ResolversParentTypes>['SendFriendRequestResponse'];
  SendFriendRequestResponseSuccess: SendFriendRequestResponseSuccess;
  Status: Status;
  Story: Story;
  StoryAttachment: StoryAttachment;
  StoryMediaAttachmentInput: StoryMediaAttachmentInput;
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateChatSettingsInput: UpdateChatSettingsInput;
  UpdateChatSettingsResponse: ResolversUnionTypes<ResolversParentTypes>['UpdateChatSettingsResponse'];
  UpdateChatSettingsResponseSuccess: UpdateChatSettingsResponseSuccess;
  UpdatePushTokenInput: UpdatePushTokenInput;
  UpdatePushTokenResponse: ResolversUnionTypes<ResolversParentTypes>['UpdatePushTokenResponse'];
  UpdatePushTokenResponseSuccess: UpdatePushTokenResponseSuccess;
  User: User;
  UserID: Scalars['UserID']['output'];
  ViewPublicProfileInput: ViewPublicProfileInput;
  ViewPublicProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ViewPublicProfileResponse'];
  ViewPublicProfileResponseSuccess: ViewPublicProfileResponseSuccess;
};

export type ChatRoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatRoom'] = ResolversParentTypes['ChatRoom']> = {
  chatRoomID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['UserID']>, ParentType, ContextType>;
  pushConfig?: Resolver<Maybe<ResolversTypes['PushConfig']>, ParentType, ContextType>;
  sendBirdChannelURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sendBirdParticipants?: Resolver<Array<ResolversTypes['UserID']>, ParentType, ContextType>;
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

export type CreateStoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStoryResponse'] = ResolversParentTypes['CreateStoryResponse']> = {
  __resolveType: TypeResolveFn<'CreateStoryResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type CreateStoryResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStoryResponseSuccess'] = ResolversParentTypes['CreateStoryResponseSuccess']> = {
  story?: Resolver<ResolversTypes['Story'], ParentType, ContextType>;
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

export type GetMyProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetMyProfileResponse'] = ResolversParentTypes['GetMyProfileResponse']> = {
  __resolveType: TypeResolveFn<'GetMyProfileResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type GetMyProfileResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetMyProfileResponseSuccess'] = ResolversParentTypes['GetMyProfileResponseSuccess']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GroupChatIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GroupChatID'], any> {
  name: 'GroupChatID';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

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
  globalDirectory?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ManageFriendshipResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManageFriendshipResponse'] = ResolversParentTypes['ManageFriendshipResponse']> = {
  __resolveType: TypeResolveFn<'ManageFriendshipResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ManageFriendshipResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManageFriendshipResponseSuccess'] = ResolversParentTypes['ManageFriendshipResponseSuccess']> = {
  status?: Resolver<ResolversTypes['FriendshipStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModifyProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyProfileResponse'] = ResolversParentTypes['ModifyProfileResponse']> = {
  __resolveType: TypeResolveFn<'ModifyProfileResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ModifyProfileResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyProfileResponseSuccess'] = ResolversParentTypes['ModifyProfileResponseSuccess']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createStory?: Resolver<ResolversTypes['CreateStoryResponse'], ParentType, ContextType, RequireFields<MutationCreateStoryArgs, 'input'>>;
  demoMutation?: Resolver<ResolversTypes['DemoMutationResponse'], ParentType, ContextType, RequireFields<MutationDemoMutationArgs, 'input'>>;
  manageFriendship?: Resolver<ResolversTypes['ManageFriendshipResponse'], ParentType, ContextType, RequireFields<MutationManageFriendshipArgs, 'input'>>;
  modifyProfile?: Resolver<ResolversTypes['ModifyProfileResponse'], ParentType, ContextType, RequireFields<MutationModifyProfileArgs, 'input'>>;
  sendFriendRequest?: Resolver<ResolversTypes['SendFriendRequestResponse'], ParentType, ContextType, RequireFields<MutationSendFriendRequestArgs, 'input'>>;
  updateChatSettings?: Resolver<ResolversTypes['UpdateChatSettingsResponse'], ParentType, ContextType, RequireFields<MutationUpdateChatSettingsArgs, 'input'>>;
  updatePushToken?: Resolver<ResolversTypes['UpdatePushTokenResponse'], ParentType, ContextType, RequireFields<MutationUpdatePushTokenArgs, 'input'>>;
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
  checkUsernameAvailable?: Resolver<ResolversTypes['CheckUsernameAvailableResponse'], ParentType, ContextType, RequireFields<QueryCheckUsernameAvailableArgs, 'input'>>;
  demoPing?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  demoQuery?: Resolver<ResolversTypes['DemoQueryResponse'], ParentType, ContextType, RequireFields<QueryDemoQueryArgs, 'input'>>;
  enterChatRoom?: Resolver<ResolversTypes['EnterChatRoomResponse'], ParentType, ContextType, RequireFields<QueryEnterChatRoomArgs, 'input'>>;
  getMyProfile?: Resolver<ResolversTypes['GetMyProfileResponse'], ParentType, ContextType>;
  listChatRooms?: Resolver<ResolversTypes['ListChatRoomsResponse'], ParentType, ContextType>;
  listContacts?: Resolver<ResolversTypes['ListContactsResponse'], ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  viewPublicProfile?: Resolver<ResolversTypes['ViewPublicProfileResponse'], ParentType, ContextType, RequireFields<QueryViewPublicProfileArgs, 'input'>>;
};

export type ResponseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseError'] = ResolversParentTypes['ResponseError']> = {
  error?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
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

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  code?: Resolver<ResolversTypes['StatusCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Story'] = ResolversParentTypes['Story']> = {
  attachments?: Resolver<Array<ResolversTypes['StoryAttachment']>, ParentType, ContextType>;
  caption?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateString']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outboundLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pinned?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  demoSubscription?: SubscriptionResolver<ResolversTypes['DemoSubscriptionEvent'], "demoSubscription", ParentType, ContextType>;
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

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateString'], ParentType, ContextType>;
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  isCreator?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPaidChat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['LanguageEnum'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privacyMode?: Resolver<ResolversTypes['PrivacyModeEnum'], ParentType, ContextType>;
  sendBirdAccessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  themeColor?: Resolver<ResolversTypes['HexColorCode'], ParentType, ContextType>;
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
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ChatRoom?: ChatRoomResolvers<ContextType>;
  CheckUsernameAvailableResponse?: CheckUsernameAvailableResponseResolvers<ContextType>;
  CheckUsernameAvailableResponseSuccess?: CheckUsernameAvailableResponseSuccessResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  CreateStoryResponse?: CreateStoryResponseResolvers<ContextType>;
  CreateStoryResponseSuccess?: CreateStoryResponseSuccessResolvers<ContextType>;
  DateString?: GraphQLScalarType;
  DemoMutatedItem?: DemoMutatedItemResolvers<ContextType>;
  DemoMutationResponse?: DemoMutationResponseResolvers<ContextType>;
  DemoMutationResponseSuccess?: DemoMutationResponseSuccessResolvers<ContextType>;
  DemoQueryResponse?: DemoQueryResponseResolvers<ContextType>;
  DemoQueryResponseSuccess?: DemoQueryResponseSuccessResolvers<ContextType>;
  DemoSubscriptionEvent?: DemoSubscriptionEventResolvers<ContextType>;
  EnterChatRoomResponse?: EnterChatRoomResponseResolvers<ContextType>;
  EnterChatRoomResponseSuccess?: EnterChatRoomResponseSuccessResolvers<ContextType>;
  GetMyProfileResponse?: GetMyProfileResponseResolvers<ContextType>;
  GetMyProfileResponseSuccess?: GetMyProfileResponseSuccessResolvers<ContextType>;
  GroupChatID?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  ListChatRoomsResponse?: ListChatRoomsResponseResolvers<ContextType>;
  ListChatRoomsResponseSuccess?: ListChatRoomsResponseSuccessResolvers<ContextType>;
  ListContactsResponse?: ListContactsResponseResolvers<ContextType>;
  ListContactsResponseSuccess?: ListContactsResponseSuccessResolvers<ContextType>;
  ManageFriendshipResponse?: ManageFriendshipResponseResolvers<ContextType>;
  ManageFriendshipResponseSuccess?: ManageFriendshipResponseSuccessResolvers<ContextType>;
  ModifyProfileResponse?: ModifyProfileResponseResolvers<ContextType>;
  ModifyProfileResponseSuccess?: ModifyProfileResponseSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Ping?: PingResolvers<ContextType>;
  PushConfig?: PushConfigResolvers<ContextType>;
  PushToken?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ResponseError?: ResponseErrorResolvers<ContextType>;
  SendBirdInternalUserID?: GraphQLScalarType;
  SendFriendRequestResponse?: SendFriendRequestResponseResolvers<ContextType>;
  SendFriendRequestResponseSuccess?: SendFriendRequestResponseSuccessResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Story?: StoryResolvers<ContextType>;
  StoryAttachment?: StoryAttachmentResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UpdateChatSettingsResponse?: UpdateChatSettingsResponseResolvers<ContextType>;
  UpdateChatSettingsResponseSuccess?: UpdateChatSettingsResponseSuccessResolvers<ContextType>;
  UpdatePushTokenResponse?: UpdatePushTokenResponseResolvers<ContextType>;
  UpdatePushTokenResponseSuccess?: UpdatePushTokenResponseSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserID?: GraphQLScalarType;
  ViewPublicProfileResponse?: ViewPublicProfileResponseResolvers<ContextType>;
  ViewPublicProfileResponseSuccess?: ViewPublicProfileResponseSuccessResolvers<ContextType>;
};

