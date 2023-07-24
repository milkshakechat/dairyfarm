// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/stripe-sandbox.ts

import { initFirebase } from "@/services/firebase";
import {
  createCustomerStripe,
  createEmptySubscriptionStripe,
  forcePaySubscriptionNow,
  initStripe,
  setStripeWebhook,
} from "@/services/stripe";

const run = async () => {
  console.log(`Running script stripe sandbox...`);
  await initFirebase();
  await initStripe();
  // await setStripeWebhook();
  // await createCustomerStripe();
  // await createEmptySubscriptionStripe();

  await forcePaySubscriptionNow({
    customerID: "cus_OJyh1GLcySvCVi",
    subscriptionID: "sub_1NXKkBBbKljWimkIoTsLsFMW",
  });
};
run();
