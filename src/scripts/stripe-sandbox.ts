// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/stripe-sandbox.ts

import { initFirebase } from "@/services/firebase";
import { createCustomerStripe, initStripe } from "@/services/stripe";

const run = async () => {
  console.log(`Running script stripe sandbox...`);
  await initFirebase();
  await initStripe();
  await createCustomerStripe();
};
run();
