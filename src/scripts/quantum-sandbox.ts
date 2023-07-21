// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/quantum-sandbox.ts

import { initFirebase } from "@/services/firebase";
import config from "@/config.env";
import {
  createGlobalStore_QuantumLedger,
  createLedger_startupScript,
  createTables_QuantumLedger,
  initQuantumLedger_Drivers,
  mockTransaction_Tx,
  seedCookiesFromStore_Tx,
  // createWallet_QuantumLedger,
  // getWallet_QuantumLedger,
  // updateWallet_QuantumLedger,
} from "@/services/quantum";
import {
  PurchaseMainfestID,
  UserID,
  WalletAliasID,
  WalletType,
} from "@milkshakechat/helpers";
import { generate256BitKey } from "@/utils/secrets";

const run = async () => {
  console.log(`Running script ledger-sandbox...`);
  await initFirebase();

  // create ledgers
  // await initQuantumLedger_AWS();
  // await createLedger_startupScript();

  // create indexes
  await initQuantumLedger_Drivers();
  // await createGlobalStore_QuantumLedger({
  //   note: "Created from developer computer",
  //   balance: 10000,
  // });
  // await createTables_QuantumLedger();
  // await generate256BitKey(); // for cross-cloud api communication

  // create wallets locally
  // await createWallet_QuantumLedger({
  //   userRelationshipHash: "___userRelationshipHash2",
  //   userID: "___userID" as UserID,
  //   title: "___title",
  //   note: "___note",
  //   type: WalletType.TRADING,
  // });
  // await getWallet_QuantumLedger({
  //   userRelationshipHash: "___userRelationshipHash2",
  // });
  // await updateWallet_QuantumLedger({
  //   userRelationshipHash: "___userRelationshipHash2",
  //   title: "___title2",
  // });

  // grant money to wallet as if a purchase
  // await seedCookiesFromStore_Tx({
  //   receivingWallet:
  //     "AQ0zDkAcd9WUT4mJBYddwgAIm0A2_main-trading-wallet" as WalletAliasID,
  //   amount: 45,
  //   purchaseManifestID:
  //     "purchase-AQ0zDkAcd9WUT4mJBYddwgAIm0A2_main-trading-wallet" as PurchaseMainfestID,
  // });

  // const amount = 1;
  // await mockTransaction_Tx({
  //   title: `Transfer ${amount} cookies`,
  //   sendingWallet:
  //     "AQ0zDkAcd9WUT4mJBYddwgAIm0A2_main-trading-wallet" as WalletAliasID,
  //   receivingWallet:
  //     "7N2FCKf8DcMzWNzQgUAFuRvygag1_main-escrow-wallet" as WalletAliasID,
  //   amount,
  //   purchaseManifestID:
  //     "initial_gift_7N2FCKf8DcMzWNzQgUAFuRvygag1_main-trading-wallet" as PurchaseMainfestID,
  // });
};
run();
