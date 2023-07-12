// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/ledger-sandbox.ts

import { initFirebase } from "@/services/firebase";
import { initQuantumLedger_AWS } from "@/services/ledger";

const run = async () => {
  console.log(`Running script ledger-sandbox...`);
  // await initFirebase();
  await initQuantumLedger_AWS();
};
run();
