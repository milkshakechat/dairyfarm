import { authGuardHTTP } from "@/graphql/authGuard";
import {
  SendTransferResponse,
  MutationRecallTransactionArgs,
  MutationSendTransferArgs,
  RecallTransactionResponse,
  MutationCreatePaymentIntentArgs,
  CreatePaymentIntentResponse,
  CreateSetupIntentResponse,
  MutationSavePaymentMethodArgs,
  SavePaymentMethodResponse,
  StatusCode,
  MutationCancelSubscriptionArgs,
  CancelSubscriptionResponse,
  MutationTopUpWalletArgs,
  TopUpWalletResponse,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import { getXCloudAWSSecret } from "@/utils/secrets";
import {
  FirestoreCollection,
  MirrorTransactionID,
  PostTransactionXCloudRequestBody,
  PurchaseMainfestID,
  TransactionType,
  TxRefID,
  Tx_MirrorFireLedger,
  UserID,
  User_Firestore,
  WalletAliasID,
  checkIfRecallable,
} from "@milkshakechat/helpers";
import axios from "axios";
import { GraphQLResolveInfo } from "graphql";
import { v4 as uuidv4 } from "uuid";
import config from "@/config.env";
import {
  attachPaymentMethodToUser,
  cancelSubscriptionPurchaseManifest,
  createPaymentIntentForWish,
  createSetupIntentStripe,
  topUpWalletStripe,
} from "@/services/stripe";

export const sendTransfer = async (
  _parent: any,
  args: MutationSendTransferArgs,
  _context: any,
  _info: any
): Promise<SendTransferResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const referenceID = uuidv4() as TxRefID;

  const [selfUser, recipientUser] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: args.input.recipientID as UserID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!selfUser || !recipientUser) {
    throw Error("No user found");
  }

  const xcloudSecret = await getXCloudAWSSecret();
  const transaction: PostTransactionXCloudRequestBody = {
    title: `@${selfUser.username} sent ${args.input.amount} cookies to @${recipientUser.username}`,
    note: ``,
    thumbnail: selfUser.avatar,
    purchaseManifestID: undefined,
    attribution: undefined,
    type: TransactionType.TRANSFER,
    amount: args.input.amount,
    senderWallet: selfUser.tradingWallet,
    receiverWallet: recipientUser.escrowWallet,
    senderUserID: selfUser.id,
    receiverUserID: recipientUser.id,
    explanations: [
      {
        walletAliasID: selfUser.tradingWallet,
        explanation: `Sent ${args.input.amount} cookies to @${recipientUser.username}`,
        amount: args.input.amount * -1,
      },
      {
        walletAliasID: recipientUser.escrowWallet,
        explanation: `@${selfUser.username} sent you ${args.input.amount} cookies`,
        amount: args.input.amount,
      },
    ],
    gotRecalled: false,
    transferMetadata: {
      senderNote: args.input.note || "",
    },
    referenceID,
    sendPushNotif: true,
  };

  axios
    .post(config.WALLET_GATEWAY.postTransaction.url, transaction, {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    })
    .then((data) => {
      // console.log(data);
    })
    .catch((err) => console.log(err));

  return {
    referenceID,
  };
};

export const recallTransaction = async (
  _parent: any,
  args: MutationRecallTransactionArgs,
  _context: any,
  _info: any
): Promise<RecallTransactionResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const referenceID = uuidv4() as TxRefID;
  const [selfUser, tx] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<MirrorTransactionID, Tx_MirrorFireLedger>({
      id: args.input.txMirrorID as MirrorTransactionID,
      collection: FirestoreCollection.MIRROR_TX,
    }),
  ]);
  if (tx.recieverUserID !== userID && tx.senderUserID !== userID) {
    throw Error("You are not a part of this transaction based on userID");
  }
  if (!checkIfRecallable(tx.createdAt)) {
    throw Error("Transaction is past recall period");
  }
  let recallerWalletID: WalletAliasID;
  if (selfUser.tradingWallet === tx.sendingWallet) {
    recallerWalletID = tx.sendingWallet;
  } else if (selfUser.escrowWallet === tx.recievingWallet) {
    recallerWalletID = tx.recievingWallet;
  } else {
    throw Error(
      "You are not a part of this transaction based on walletAliasID"
    );
  }

  const xcloudSecret = await getXCloudAWSSecret();
  const params = {
    transactionID: tx.txID,
    recallerWalletID,
    recallerNote: args.input.recallerNote || "",
    referenceID,
  };
  axios
    .post(config.WALLET_GATEWAY.recallTransaction.url, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    })
    .then((data) => {
      // console.log(data);
    })
    .catch((err) => console.log(err));
  return {
    referenceID,
  };
};

export const createPaymentIntent = async (
  _parent: any,
  args: MutationCreatePaymentIntentArgs,
  _context: any,
  _info: any
): Promise<CreatePaymentIntentResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const { checkoutToken, referenceID, purchaseManifestID } =
    await createPaymentIntentForWish({
      wishSuggest: args.input.wishSuggest,
      userID,
      note: args.input.note || "",
      attribution: args.input.attribution || "",
      promoCode: args.input.promoCode || "",
    });
  return {
    checkoutToken,
    referenceID,
    purchaseManifestID,
  };
};

export const createSetupIntent = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
): Promise<CreateSetupIntentResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const setupIntent = await createSetupIntentStripe({
    userID,
  });
  if (!setupIntent.client_secret) {
    throw Error("No client secret found");
  }
  return {
    clientSecret: setupIntent.client_secret,
  };
};

export const savePaymentMethod = async (
  _parent: any,
  args: MutationSavePaymentMethodArgs,
  _context: any,
  _info: any
): Promise<SavePaymentMethodResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  try {
    const res = await attachPaymentMethodToUser({
      userID,
      paymentMethodID: args.input.paymentMethodID,
      isDefault: true,
      email: args.input.email ? args.input.email : undefined,
    });
    return {
      paymentMethodID: res.id,
    };
  } catch (e) {
    console.log(e);
    return {
      error: {
        code: StatusCode.ServerError,
        message:
          (e as any).message ||
          `An error occurred attaching the payment to user ${userID}`,
      },
    };
  }
};

export const cancelSubscription = async (
  _parent: any,
  args: MutationCancelSubscriptionArgs,
  _context: any,
  _info: any
): Promise<CancelSubscriptionResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const res = await cancelSubscriptionPurchaseManifest({
    purchaseManifestID: args.input.purchaseManifestID as PurchaseMainfestID,
    userID,
  });
  return {
    status: `Successfully cancelled subscription ${args.input.purchaseManifestID}`,
  };
};

export const topUpWallet = async (
  _parent: any,
  args: MutationTopUpWalletArgs,
  _context: any,
  _info: any
): Promise<TopUpWalletResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const { checkoutToken, referenceID, purchaseManifestID } =
    await topUpWalletStripe(args, userID);
  return {
    checkoutToken,
    referenceID,
    purchaseManifestID,
  };
};

export const responses = {
  SendTransferResponse: {
    __resolveType(
      obj: SendTransferResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("referenceID" in obj) {
        return "SendTransferResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  RecallTransactionResponse: {
    __resolveType(
      obj: RecallTransactionResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("referenceID" in obj) {
        return "RecallTransactionResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  CreatePaymentIntentResponse: {
    __resolveType(
      obj: CreatePaymentIntentResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("referenceID" in obj && "purchaseManifestID" in obj) {
        return "CreatePaymentIntentResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  CreateSetupIntentResponse: {
    __resolveType(
      obj: CreateSetupIntentResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("clientSecret" in obj) {
        return "CreateSetupIntentResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  SavePaymentMethodResponse: {
    __resolveType(
      obj: SavePaymentMethodResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("paymentMethodID" in obj) {
        return "SavePaymentMethodResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  CancelSubscriptionResponse: {
    __resolveType(
      obj: CancelSubscriptionResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "CancelSubscriptionResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  TopUpWalletResponse: {
    __resolveType(
      obj: TopUpWalletResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("referenceID" in obj) {
        return "TopUpWalletResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
