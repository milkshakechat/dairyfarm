// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/ledger-sandbox.ts

import { initFirebase } from "@/services/firebase";
import config from "@/config.env";
import {
  createLedger_startupScript,
  createTables_QuantumLedger,
  initQuantumLedger_Drivers,
  // createWallet_QuantumLedger,
  // getWallet_QuantumLedger,
  // updateWallet_QuantumLedger,
} from "@/services/quantum";
import { UserID, WalletType } from "@milkshakechat/helpers";
import { generate256BitKey } from "@/utils/secrets";

const run = async () => {
  console.log(`Running script ledger-sandbox...`);
  // await initFirebase();

  // create ledgers
  // await initQuantumLedger_AWS();
  // await createLedger_startupScript();

  // create indexes
  // await initQuantumLedger_Drivers();
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

  // create wallets using the aws api gateway (wallet-gateway)
};
run();
