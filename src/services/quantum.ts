import {
  QLDBClient,
  DescribeLedgerCommand,
  CreateLedgerCommand,
} from "@aws-sdk/client-qldb";
import { accessLocalAWSKeyFile } from "@/utils/secrets";
import config from "@/config.env";
import { sleep } from "@/utils/utils";
import { Agent } from "https";
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
    await txn.execute(`CREATE INDEX ON Wallets (ownerID)`);
    await txn.execute(`CREATE INDEX ON Wallets (userRelationshipHash)`);
    await txn.execute(`CREATE INDEX ON Transactions (id)`);
    await txn.execute(`CREATE INDEX ON Transactions (userRelationshipHash)`);
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
