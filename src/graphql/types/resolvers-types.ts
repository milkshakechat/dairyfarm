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

export type ListContactsResponse = ListContactsResponseSuccess | ResponseError;

export type ListContactsResponseSuccess = {
  __typename?: 'ListContactsResponseSuccess';
  contacts: Array<Contact>;
  globalDirectory: Array<Contact>;
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
  demoMutation: DemoMutationResponse;
  modifyProfile: ModifyProfileResponse;
  sendFriendRequest: SendFriendRequestResponse;
  updatePushToken: UpdatePushTokenResponse;
};


export type MutationDemoMutationArgs = {
  input: DemoMutationInput;
};


export type MutationModifyProfileArgs = {
  input: ModifyProfileInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
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

export type Query = {
  __typename?: 'Query';
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  getMyProfile: GetMyProfileResponse;
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

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
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
  themeColor: Scalars['HexColorCode']['output'];
  username: Scalars['String']['output'];
};

export type ViewPublicProfileInput = {
  username: Scalars['String']['input'];
};

export type ViewPublicProfileResponse = ResponseError | ViewPublicProfileResponseSuccess;

export type ViewPublicProfileResponseSuccess = {
  __typename?: 'ViewPublicProfileResponseSuccess';
  avatar?: Maybe<Scalars['String']['output']>;
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
  DemoMutationResponse: ( DemoMutationResponseSuccess ) | ( ResponseError );
  DemoQueryResponse: ( DemoQueryResponseSuccess ) | ( ResponseError );
  GetMyProfileResponse: ( GetMyProfileResponseSuccess ) | ( ResponseError );
  ListContactsResponse: ( ListContactsResponseSuccess ) | ( ResponseError );
  ModifyProfileResponse: ( ModifyProfileResponseSuccess ) | ( ResponseError );
  SendFriendRequestResponse: ( ResponseError ) | ( SendFriendRequestResponseSuccess );
  UpdatePushTokenResponse: ( ResponseError ) | ( UpdatePushTokenResponseSuccess );
  ViewPublicProfileResponse: ( ResponseError ) | ( ViewPublicProfileResponseSuccess );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CheckUsernameAvailableResponse']>;
  CheckUsernameAvailableResponseSuccess: ResolverTypeWrapper<CheckUsernameAvailableResponseSuccess>;
  Contact: ResolverTypeWrapper<Contact>;
  DateString: ResolverTypeWrapper<Scalars['DateString']['output']>;
  DemoMutatedItem: ResolverTypeWrapper<DemoMutatedItem>;
  DemoMutationInput: DemoMutationInput;
  DemoMutationResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DemoMutationResponse']>;
  DemoMutationResponseSuccess: ResolverTypeWrapper<DemoMutationResponseSuccess>;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DemoQueryResponse']>;
  DemoQueryResponseSuccess: ResolverTypeWrapper<DemoQueryResponseSuccess>;
  DemoSubscriptionEvent: ResolverTypeWrapper<DemoSubscriptionEvent>;
  FriendshipStatus: FriendshipStatus;
  GetMyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetMyProfileResponse']>;
  GetMyProfileResponseSuccess: ResolverTypeWrapper<GetMyProfileResponseSuccess>;
  GroupChatID: ResolverTypeWrapper<Scalars['GroupChatID']['output']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LanguageEnum: LanguageEnum;
  ListContactsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ListContactsResponse']>;
  ListContactsResponseSuccess: ResolverTypeWrapper<ListContactsResponseSuccess>;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ModifyProfileResponse']>;
  ModifyProfileResponseSuccess: ResolverTypeWrapper<ModifyProfileResponseSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  Ping: ResolverTypeWrapper<Ping>;
  PrivacyModeEnum: PrivacyModeEnum;
  PushToken: ResolverTypeWrapper<Scalars['PushToken']['output']>;
  Query: ResolverTypeWrapper<{}>;
  ResponseError: ResolverTypeWrapper<ResponseError>;
  SendBirdInternalUserID: ResolverTypeWrapper<Scalars['SendBirdInternalUserID']['output']>;
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SendFriendRequestResponse']>;
  SendFriendRequestResponseSuccess: ResolverTypeWrapper<SendFriendRequestResponseSuccess>;
  Status: ResolverTypeWrapper<Status>;
  StatusCode: StatusCode;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
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
  CheckUsernameAvailableInput: CheckUsernameAvailableInput;
  CheckUsernameAvailableResponse: ResolversUnionTypes<ResolversParentTypes>['CheckUsernameAvailableResponse'];
  CheckUsernameAvailableResponseSuccess: CheckUsernameAvailableResponseSuccess;
  Contact: Contact;
  DateString: Scalars['DateString']['output'];
  DemoMutatedItem: DemoMutatedItem;
  DemoMutationInput: DemoMutationInput;
  DemoMutationResponse: ResolversUnionTypes<ResolversParentTypes>['DemoMutationResponse'];
  DemoMutationResponseSuccess: DemoMutationResponseSuccess;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolversUnionTypes<ResolversParentTypes>['DemoQueryResponse'];
  DemoQueryResponseSuccess: DemoQueryResponseSuccess;
  DemoSubscriptionEvent: DemoSubscriptionEvent;
  GetMyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['GetMyProfileResponse'];
  GetMyProfileResponseSuccess: GetMyProfileResponseSuccess;
  GroupChatID: Scalars['GroupChatID']['output'];
  HexColorCode: Scalars['HexColorCode']['output'];
  ID: Scalars['ID']['output'];
  ListContactsResponse: ResolversUnionTypes<ResolversParentTypes>['ListContactsResponse'];
  ListContactsResponseSuccess: ListContactsResponseSuccess;
  ModifyProfileInput: ModifyProfileInput;
  ModifyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ModifyProfileResponse'];
  ModifyProfileResponseSuccess: ModifyProfileResponseSuccess;
  Mutation: {};
  Ping: Ping;
  PushToken: Scalars['PushToken']['output'];
  Query: {};
  ResponseError: ResponseError;
  SendBirdInternalUserID: Scalars['SendBirdInternalUserID']['output'];
  SendFriendRequestInput: SendFriendRequestInput;
  SendFriendRequestResponse: ResolversUnionTypes<ResolversParentTypes>['SendFriendRequestResponse'];
  SendFriendRequestResponseSuccess: SendFriendRequestResponseSuccess;
  Status: Status;
  String: Scalars['String']['output'];
  Subscription: {};
  UpdatePushTokenInput: UpdatePushTokenInput;
  UpdatePushTokenResponse: ResolversUnionTypes<ResolversParentTypes>['UpdatePushTokenResponse'];
  UpdatePushTokenResponseSuccess: UpdatePushTokenResponseSuccess;
  User: User;
  UserID: Scalars['UserID']['output'];
  ViewPublicProfileInput: ViewPublicProfileInput;
  ViewPublicProfileResponse: ResolversUnionTypes<ResolversParentTypes>['ViewPublicProfileResponse'];
  ViewPublicProfileResponseSuccess: ViewPublicProfileResponseSuccess;
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

export type ListContactsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListContactsResponse'] = ResolversParentTypes['ListContactsResponse']> = {
  __resolveType: TypeResolveFn<'ListContactsResponseSuccess' | 'ResponseError', ParentType, ContextType>;
};

export type ListContactsResponseSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListContactsResponseSuccess'] = ResolversParentTypes['ListContactsResponseSuccess']> = {
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  globalDirectory?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
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
  demoMutation?: Resolver<ResolversTypes['DemoMutationResponse'], ParentType, ContextType, RequireFields<MutationDemoMutationArgs, 'input'>>;
  modifyProfile?: Resolver<ResolversTypes['ModifyProfileResponse'], ParentType, ContextType, RequireFields<MutationModifyProfileArgs, 'input'>>;
  sendFriendRequest?: Resolver<ResolversTypes['SendFriendRequestResponse'], ParentType, ContextType, RequireFields<MutationSendFriendRequestArgs, 'input'>>;
  updatePushToken?: Resolver<ResolversTypes['UpdatePushTokenResponse'], ParentType, ContextType, RequireFields<MutationUpdatePushTokenArgs, 'input'>>;
};

export type PingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ping'] = ResolversParentTypes['Ping']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PushTokenScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PushToken'], any> {
  name: 'PushToken';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkUsernameAvailable?: Resolver<ResolversTypes['CheckUsernameAvailableResponse'], ParentType, ContextType, RequireFields<QueryCheckUsernameAvailableArgs, 'input'>>;
  demoPing?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  demoQuery?: Resolver<ResolversTypes['DemoQueryResponse'], ParentType, ContextType, RequireFields<QueryDemoQueryArgs, 'input'>>;
  getMyProfile?: Resolver<ResolversTypes['GetMyProfileResponse'], ParentType, ContextType>;
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

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  demoSubscription?: SubscriptionResolver<ResolversTypes['DemoSubscriptionEvent'], "demoSubscription", ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['UserID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CheckUsernameAvailableResponse?: CheckUsernameAvailableResponseResolvers<ContextType>;
  CheckUsernameAvailableResponseSuccess?: CheckUsernameAvailableResponseSuccessResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  DateString?: GraphQLScalarType;
  DemoMutatedItem?: DemoMutatedItemResolvers<ContextType>;
  DemoMutationResponse?: DemoMutationResponseResolvers<ContextType>;
  DemoMutationResponseSuccess?: DemoMutationResponseSuccessResolvers<ContextType>;
  DemoQueryResponse?: DemoQueryResponseResolvers<ContextType>;
  DemoQueryResponseSuccess?: DemoQueryResponseSuccessResolvers<ContextType>;
  DemoSubscriptionEvent?: DemoSubscriptionEventResolvers<ContextType>;
  GetMyProfileResponse?: GetMyProfileResponseResolvers<ContextType>;
  GetMyProfileResponseSuccess?: GetMyProfileResponseSuccessResolvers<ContextType>;
  GroupChatID?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  ListContactsResponse?: ListContactsResponseResolvers<ContextType>;
  ListContactsResponseSuccess?: ListContactsResponseSuccessResolvers<ContextType>;
  ModifyProfileResponse?: ModifyProfileResponseResolvers<ContextType>;
  ModifyProfileResponseSuccess?: ModifyProfileResponseSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Ping?: PingResolvers<ContextType>;
  PushToken?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ResponseError?: ResponseErrorResolvers<ContextType>;
  SendBirdInternalUserID?: GraphQLScalarType;
  SendFriendRequestResponse?: SendFriendRequestResponseResolvers<ContextType>;
  SendFriendRequestResponseSuccess?: SendFriendRequestResponseSuccessResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UpdatePushTokenResponse?: UpdatePushTokenResponseResolvers<ContextType>;
  UpdatePushTokenResponseSuccess?: UpdatePushTokenResponseSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserID?: GraphQLScalarType;
  ViewPublicProfileResponse?: ViewPublicProfileResponseResolvers<ContextType>;
  ViewPublicProfileResponseSuccess?: ViewPublicProfileResponseSuccessResolvers<ContextType>;
};

