import {
  QLDBClient,
  DescribeLedgerCommand,
  CreateLedgerCommand,
} from "@aws-sdk/client-qldb";
import { accessLocalAWSKeyFile, getXCloudAWSSecret } from "@/utils/secrets";
import config from "@/config.env";
import { sleep } from "@/utils/utils";
import { Agent } from "https";
import {
  FirestoreCollection,
  GetWalletXCloudRequestBody,
  GetWalletXCloudResponseBody,
  PostTransactionXCloudRequestBody,
  PostTransactionXCloudResponseBody,
  PurchaseMainfestID,
  TransactionType,
  WalletAliasID,
  Wallet_MirrorFireLedger,
  generateGlobalStoreAliasID,
} from "@milkshakechat/helpers";
import { QLDBSessionClientConfig } from "@aws-sdk/client-qldb-session";
import {
  QldbDriver,
  RetryConfig,
  TransactionExecutor,
} from "amazon-qldb-driver-nodejs";
import { NodeHttpHandlerOptions } from "@aws-sdk/node-http-handler";
import {
  UserID,
  UserRelationshipHash,
  WalletID,
  WalletType,
  Wallet_Quantum,
} from "@milkshakechat/helpers";
import { v4 as uuidv4 } from "uuid";
import { dom, load, dumpBinary } from "ion-js";
import axios from "axios";
import { getFirestoreDoc } from "./firestore";

/**
 * Use the quantumLedger SDK to create ledgers
 * - can create ledgers
 * - cannot interact with ledgers (use the qldbDriver instead)
 */
export let quantumLedger: QLDBClient;
export const initQuantumLedger_AWS = async () => {
  console.log(
    `Init AWS Quantum Ledger database in region="${config.LEDGER.region}"`
  );
  const credentials = await accessLocalAWSKeyFile();
  // Create a QLDB client
  quantumLedger = new QLDBClient({
    region: config.LEDGER.region,
    credentials: {
      accessKeyId: credentials.accessKey,
      secretAccessKey: credentials.secretKey,
    },
  });
  console.log(`AWS QLDB client created`);
  return quantumLedger;
};
// run this script for every ledger you want to create
export const createLedger_startupScript = async () => {
  const LEDGER_NAME = config.LEDGER.name;
  console.log(`Creating a ledger named: ${LEDGER_NAME}...`);
  const input_1 = {
    // CreateLedgerRequest
    Name: LEDGER_NAME, // required
    PermissionsMode: "STANDARD", // required
    DeletionProtection: true,
  };
  const command_1 = new CreateLedgerCommand(input_1);
  const response_1 = await quantumLedger.send(command_1);

  while (true) {
    const input_2 = {
      // DescribeLedgerRequest
      Name: LEDGER_NAME, // required
    };
    const command_2 = new DescribeLedgerCommand(input_2);
    const response_2 = await quantumLedger.send(command_2);
    if (response_2.State === "ACTIVE") {
      console.log("Success. Ledger is active and ready to be used.");
      return response_2;
    }
    console.log("The ledger is still creating. Please wait...");
    await sleep(10000);
  }
};

export const createTables_QuantumLedger = async () => {
  // https://chat.openai.com/c/0c39b4c2-f321-40d3-946c-2de5d0294f98
  await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
    await txn.execute("CREATE TABLE Wallets");
    await txn.execute("CREATE TABLE Transactions");
  });

  await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
    await txn.execute(`CREATE INDEX ON Wallets (id)`);
    await txn.execute(`CREATE INDEX ON Wallets (docId)`);
    await txn.execute(`CREATE INDEX ON Wallets (walletAliasID)`);
    await txn.execute(`CREATE INDEX ON Transactions (id)`);
  });
};

/**
 * Use the qldbDriver to interact with ledgers
 * - can interact with ledgers
 * - cannot create ledgers (use the quantumLedger instead)
 */
export let qldbDriver: QldbDriver;
export const initQuantumLedger_Drivers = async () => {
  const maxConcurrentTransactions: number = 10;
  const retryLimit: number = 4;
  //Reuse connections with keepAlive
  const lowLevelClientHttpOptions: NodeHttpHandlerOptions = {
    httpAgent: new Agent({
      maxSockets: maxConcurrentTransactions,
    }),
  };
  const credentials = await accessLocalAWSKeyFile();
  const serviceConfigurationOptions: QLDBSessionClientConfig = {
    region: config.LEDGER.region,
    credentials: {
      accessKeyId: credentials.accessKey,
      secretAccessKey: credentials.secretKey,
    },
  };
  const retryConfig: RetryConfig = new RetryConfig(retryLimit);

  // init the ledger
  qldbDriver = new QldbDriver(
    config.LEDGER.name,
    serviceConfigurationOptions,
    lowLevelClientHttpOptions,
    maxConcurrentTransactions,
    retryConfig
  );
  qldbDriver.getTableNames().then(function (tableNames: string[]) {
    console.log(tableNames);
  });
  return qldbDriver;
};

export const createGlobalStore_QuantumLedger = async ({
  note = "",
  balance,
}: {
  note?: string;
  balance: number;
}) => {
  const walletAliasID = config.LEDGER.premiumChatStore.walletAliasID;
  // const walletAliasID = config.LEDGER.globalCookieStore.walletAliasID;

  const ownerID = config.LEDGER.premiumChatStore.userID;
  console.log(`Creating global store with walletAliasID=${walletAliasID}`);
  // if (qldbDriver) {
  //   await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
  //     // Check if doc with match condition exists
  //     // This is critical to make this transaction idempotent
  //     const id = uuidv4();
  //     const now = new Date().toISOString();
  //     const doc: Record<string, any> = {
  //       id: id,
  //       walletAliasID,
  //       ownerID: config.LEDGER.globalCookieStore.userID,
  //       title: `Global Store - ${walletAliasID}`,
  //       note,
  //       type: WalletType.STORE,
  //       balance,
  //       isLocked: false,
  //       createdAt: now,
  //     };
  //     // Create a sample Ion doc
  //     const ionDoc = load(dumpBinary(doc));
  //     if (ionDoc !== null) {
  //       const result = await txn.execute("INSERT INTO Wallets ?", ionDoc);
  //       const insertedDocument = result.getResultList()[0];
  //       console.log(
  //         `Successfully inserted document into table: ${JSON.stringify(
  //           insertedDocument
  //         )}`
  //       );
  //     }
  //   });
  // }
  const xcloudSecret = await getXCloudAWSSecret();
  const wallet = {
    title: `Upgrade Premium Chat - ${walletAliasID}`,
    note,
    userID: ownerID,
    type: WalletType.STORE,
    walletAliasID,
  };
  const data = await axios.post(
    "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/wallet",
    wallet,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    }
  );
  console.log(data);
};

export const seedCookiesFromStore_Tx = async ({
  title = "Seed cookies from global store",
  receivingWallet,
  amount,
  purchaseManifestID,
}: {
  receivingWallet: WalletAliasID;
  amount: number;
  title?: string;
  purchaseManifestID: PurchaseMainfestID;
}) => {
  console.log("seedCookiesFromStore_Tx...");
  const xcloudSecret = await getXCloudAWSSecret();

  const wallet = await getFirestoreDoc<WalletAliasID, Wallet_MirrorFireLedger>({
    id: receivingWallet,
    collection: FirestoreCollection.MIRROR_WALLETS,
  });

  const transaction: PostTransactionXCloudRequestBody = {
    title,
    note: title,
    purchaseManifestID,
    attribution: "",
    type: TransactionType.TOP_UP,
    amount,
    senderWallet: config.LEDGER.globalCookieStore.walletAliasID,
    receiverWallet: receivingWallet,
    receiverUserID: wallet.ownerID,
    senderUserID: config.LEDGER.globalCookieStore.userID,
    explanations: [
      {
        walletAliasID: receivingWallet,
        explanation: `Magically gifted ${amount} cookies by Global Store`,
        amount,
      },
      {
        walletAliasID: config.LEDGER.globalCookieStore.walletAliasID,
        explanation: `Seed ${amount} cookies into user`,
        amount: -amount,
      },
    ],
    gotRecalled: false,
    topUpMetadata: {
      internalNote: "Developer top up",
    },
  };
  console.log(`transaction`, transaction);
  const data = await axios.post(
    config.WALLET_GATEWAY.postTransaction.url,
    transaction,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    }
  );
  console.log(data);
};

export const mockTransaction_Tx = async ({
  title,
  sendingWallet,
  receivingWallet,
  amount,
  purchaseManifestID,
}: {
  sendingWallet: WalletAliasID;
  receivingWallet: WalletAliasID;
  amount: number;
  title: string;
  purchaseManifestID: PurchaseMainfestID;
}) => {
  console.log("mockTransaction_Tx...");
  const xcloudSecret = await getXCloudAWSSecret();

  const [senderWallet, receiverWallet] = await Promise.all([
    getFirestoreDoc<WalletAliasID, Wallet_MirrorFireLedger>({
      id: sendingWallet,
      collection: FirestoreCollection.MIRROR_WALLETS,
    }),
    getFirestoreDoc<WalletAliasID, Wallet_MirrorFireLedger>({
      id: receivingWallet,
      collection: FirestoreCollection.MIRROR_WALLETS,
    }),
  ]);

  const transaction: PostTransactionXCloudRequestBody = {
    title,
    note: title,
    purchaseManifestID,
    attribution: "",
    type: TransactionType.TRANSFER,
    amount,
    senderWallet: sendingWallet,
    receiverWallet: receivingWallet,
    receiverUserID: receiverWallet.ownerID,
    senderUserID: senderWallet.ownerID,
    explanations: [
      {
        walletAliasID: receivingWallet,
        explanation: `Received ${amount} cookies from ${sendingWallet}`,
        amount,
      },
      {
        walletAliasID: sendingWallet,
        explanation: `Sent ${amount} cookies to ${receivingWallet}`,
        amount: -amount,
      },
    ],
    gotRecalled: false,
    transferMetadata: {
      senderNote: "Developer testing",
    },
  };
  console.log(`transaction`, transaction);
  const data = await axios.post(
    config.WALLET_GATEWAY.postTransaction.url,
    transaction,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    }
  );
  console.log(data);
};

export const _postTransaction = async (
  transaction: PostTransactionXCloudRequestBody
) => {
  const xcloudSecret = await getXCloudAWSSecret();
  console.log(`transaction`, transaction);
  try {
    const { data }: { data: PostTransactionXCloudResponseBody } =
      await axios.post(config.WALLET_GATEWAY.postTransaction.url, transaction, {
        headers: {
          "Content-Type": "application/json",
          Authorization: xcloudSecret,
        },
        timeout: 1000 * 120, // wait 2 mins
      });
    return data.transaction;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getWalletQLDB = async ({
  walletAliasID,
}: {
  walletAliasID: WalletAliasID;
}) => {
  const xcloudSecret = await getXCloudAWSSecret();
  const params: GetWalletXCloudRequestBody = {
    walletAliasID,
  };

  const { data }: { data: GetWalletXCloudResponseBody } = await axios.get(
    config.WALLET_GATEWAY.getWallet.url,
    {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    }
  );
  const { wallet } = data;
  console.log(`---- wallet`);
  return wallet;
};

// export const createWallet_QuantumLedger = async ({
//   userRelationshipHash,
//   userID,
//   title,
//   note = "",
//   type,
// }: {
//   userRelationshipHash: UserRelationshipHash;
//   userID: UserID;
//   title: string;
//   note?: string;
//   type: WalletType;
// }) => {
//   await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
//     // Check if doc with match condition exists
//     // This is critical to make this transaction idempotent
//     const results = (
//       await txn.execute(
//         "SELECT * FROM Wallets WHERE userRelationshipHash = ?",
//         userRelationshipHash
//       )
//     ).getResultList();
//     // Insert the document after ensuring it doesn't already exist
//     if (results.length == 0) {
//       const id = uuidv4();
//       const now = new Date().toISOString();
//       const doc: Record<string, any> = {
//         id: id,
//         userRelationshipHash: userRelationshipHash,
//         ownerID: userID,
//         title,
//         note,
//         type,
//         balance: 0,
//         isLocked: false,
//         createdAt: now,
//       };
//       // Create a sample Ion doc
//       const ionDoc = load(dumpBinary(doc));
//       if (ionDoc !== null) {
//         const result = await txn.execute("INSERT INTO Wallets ?", ionDoc);
//         const insertedDocument = result.getResultList()[0];
//         console.log(
//           `Successfully inserted document into table: ${JSON.stringify(
//             insertedDocument
//           )}`
//         );
//       }
//     }
//   });
// };

// export const getWallet_QuantumLedger = async ({
//   userRelationshipHash,
// }: {
//   userRelationshipHash: UserRelationshipHash;
// }) => {
//   const p = new Promise(async (res, rej) => {
//     await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
//       const results = (
//         await txn.execute(
//           `SELECT * FROM Wallets WHERE userRelationshipHash = '${userRelationshipHash}'`
//         )
//       ).getResultList();
//       const matches = results.map((result) => {
//         const wallet: Wallet_Quantum = {
//           id: (result.get("id") || "") as WalletID,
//           userRelationshipHash: (result.get("userRelationshipHash") ||
//             "") as UserRelationshipHash,
//           ownerID: (result.get("ownerID") || "") as UserID,
//           title: (result.get("title") || "") as string,
//           note: (result.get("note") || "") as string,
//           createdAt: new Date((result.get("createdAt") || "0") as string),
//           balance: (result.get("balance") || 0) as number,
//           type: (result.get("type") || "") as WalletType,
//           isLocked: (result.get("isLocked") || false) as boolean,
//         };
//         console.log(`Found wallet: ${JSON.stringify(wallet)}`);
//         return wallet;
//       });
//       res(matches);
//     });
//   });
//   return p;
// };

// export const updateWallet_QuantumLedger = async ({
//   userRelationshipHash,
//   title,
//   note,
// }: {
//   userRelationshipHash: UserRelationshipHash;
//   title?: string;
//   note?: string;
// }) => {
//   await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
//     const _title = title ? load(title) : null;
//     const _note = note ? load(note) : null;
//     const result = await txn.execute(
//       `
//         UPDATE Wallets
//         ${_title ? `SET title = '${title}'` : ""}
//         ${_note ? `SET note = '${note}'` : ""}
//         WHERE userRelationshipHash = '${userRelationshipHash}'
//       `
//     );
//     const updatedDocument = result.getResultList()[0];
//     console.log(
//       `Successfully updated document into table: ${JSON.stringify(
//         updatedDocument
//       )}`
//     );
//     return updatedDocument;
//   });
// };
