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
  GroupChatID: { input: any; output: any; }
  UserID: { input: any; output: any; }
};

export type DemoMutatedItem = {
  __typename?: 'DemoMutatedItem';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
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

export type GetMyProfileResponse = GetMyProfileResponseSuccess | ResponseError;

export type GetMyProfileResponseSuccess = {
  __typename?: 'GetMyProfileResponseSuccess';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  demoMutation: DemoMutatedItem;
};


export type MutationDemoMutationArgs = {
  title: Scalars['String']['input'];
};

export type Ping = {
  __typename?: 'Ping';
  timestamp: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  getMyProfile: GetMyProfileResponse;
  ping: Ping;
};


export type QueryDemoQueryArgs = {
  input: DemoQueryInput;
};

export type ResponseError = {
  __typename?: 'ResponseError';
  error: Status;
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
  DemoQueryResponse: ( DemoQueryResponseSuccess ) | ( ResponseError );
  GetMyProfileResponse: ( GetMyProfileResponseSuccess ) | ( ResponseError );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DemoMutatedItem: ResolverTypeWrapper<DemoMutatedItem>;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DemoQueryResponse']>;
  DemoQueryResponseSuccess: ResolverTypeWrapper<DemoQueryResponseSuccess>;
  DemoSubscriptionEvent: ResolverTypeWrapper<DemoSubscriptionEvent>;
  GetMyProfileResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetMyProfileResponse']>;
  GetMyProfileResponseSuccess: ResolverTypeWrapper<GetMyProfileResponseSuccess>;
  GroupChatID: ResolverTypeWrapper<Scalars['GroupChatID']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Ping: ResolverTypeWrapper<Ping>;
  Query: ResolverTypeWrapper<{}>;
  ResponseError: ResolverTypeWrapper<ResponseError>;
  Status: ResolverTypeWrapper<Status>;
  StatusCode: StatusCode;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UserID: ResolverTypeWrapper<Scalars['UserID']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  DemoMutatedItem: DemoMutatedItem;
  DemoQueryInput: DemoQueryInput;
  DemoQueryResponse: ResolversUnionTypes<ResolversParentTypes>['DemoQueryResponse'];
  DemoQueryResponseSuccess: DemoQueryResponseSuccess;
  DemoSubscriptionEvent: DemoSubscriptionEvent;
  GetMyProfileResponse: ResolversUnionTypes<ResolversParentTypes>['GetMyProfileResponse'];
  GetMyProfileResponseSuccess: GetMyProfileResponseSuccess;
  GroupChatID: Scalars['GroupChatID']['output'];
  ID: Scalars['ID']['output'];
  Mutation: {};
  Ping: Ping;
  Query: {};
  ResponseError: ResponseError;
  Status: Status;
  String: Scalars['String']['output'];
  Subscription: {};
  UserID: Scalars['UserID']['output'];
};

export type DemoMutatedItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['DemoMutatedItem'] = ResolversParentTypes['DemoMutatedItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GroupChatIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GroupChatID'], any> {
  name: 'GroupChatID';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  demoMutation?: Resolver<ResolversTypes['DemoMutatedItem'], ParentType, ContextType, RequireFields<MutationDemoMutationArgs, 'title'>>;
};

export type PingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ping'] = ResolversParentTypes['Ping']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  demoPing?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
  demoQuery?: Resolver<ResolversTypes['DemoQueryResponse'], ParentType, ContextType, RequireFields<QueryDemoQueryArgs, 'input'>>;
  getMyProfile?: Resolver<ResolversTypes['GetMyProfileResponse'], ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['Ping'], ParentType, ContextType>;
};

export type ResponseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseError'] = ResolversParentTypes['ResponseError']> = {
  error?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
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

export interface UserIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UserID'], any> {
  name: 'UserID';
}

export type Resolvers<ContextType = any> = {
  DemoMutatedItem?: DemoMutatedItemResolvers<ContextType>;
  DemoQueryResponse?: DemoQueryResponseResolvers<ContextType>;
  DemoQueryResponseSuccess?: DemoQueryResponseSuccessResolvers<ContextType>;
  DemoSubscriptionEvent?: DemoSubscriptionEventResolvers<ContextType>;
  GetMyProfileResponse?: GetMyProfileResponseResolvers<ContextType>;
  GetMyProfileResponseSuccess?: GetMyProfileResponseSuccessResolvers<ContextType>;
  GroupChatID?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Ping?: PingResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ResponseError?: ResponseErrorResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UserID?: GraphQLScalarType;
};

