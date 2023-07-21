import { authGuardHTTP } from "@/graphql/authGuard";
import {
  SendTransferResponse,
  MutationRecallTransactionArgs,
  MutationSendTransferArgs,
  RecallTransactionResponse,
  MutationCreatePaymentIntentArgs,
  CreatePaymentIntentResponse,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import { getXCloudAWSSecret } from "@/utils/secrets";
import {
  FirestoreCollection,
  MirrorTransactionID,
  PostTransactionXCloudRequestBody,
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
import { createPaymentIntentForWish } from "@/services/stripe";

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

  console.log(`------- args`, args);

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
  console.log(`selfUser`, selfUser);
  console.log(`recipientUser`, recipientUser);
  if (!selfUser || !recipientUser) {
    throw Error("No user found");
  }

  const xcloudSecret = await getXCloudAWSSecret();
  const transaction: PostTransactionXCloudRequestBody = {
    title: `@${selfUser.username} sent ${args.input.amount} cookies to @${recipientUser.username}`,
    note: ``,
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
  };
  console.log(`transaction`, transaction);
  axios
    .post(config.WALLET_GATEWAY.postTransaction.url, transaction, {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    })
    .then((data) => {
      console.log(data);
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
      console.log(data);
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
  const { checkoutToken, referenceID } = await createPaymentIntentForWish({
    wishSuggest: args.input.wishSuggest,
    userID,
    note: args.input.note || "",
    attribution: args.input.attribution || "",
    promoCode: args.input.promoCode || "",
  });
  console.log(`checkoutToken = ${checkoutToken}`);
  console.log(`referenceID = ${referenceID}`);
  return {
    checkoutToken,
    referenceID,
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
      console.log(`----= === = = = RecallTransactionResponse`);
      console.log(obj);
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
      if ("referenceID" in obj) {
        return "CreatePaymentIntentResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
