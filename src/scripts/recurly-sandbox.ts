// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/recurly-sandbox.ts

import { initFirebase } from "@/services/firebase";
import {
  addPaymentMethodToRecurlyCustomer,
  appendRecurlySubscriptionAddOn,
  createRecurlyCustomer,
  createRecurlyItem,
  createRecurlyPlan,
  createRecurlyPlanAddOn,
  createRecurlySubscription,
  getRecurlyCustomer,
  getRecurlyPlan,
  getRecurlySubscription,
  initRecurly,
  listRecurlyPlanAddOns,
} from "@/services/recurly";
import { v4 as uuidv4 } from "uuid";
import {
  createCustomerStripe,
  createEmptySubscriptionStripe,
  forcePaySubscriptionNow,
  initStripe,
  setStripeWebhook,
} from "@/services/stripe";
import {
  PurchaseMainfestID,
  RecurlyCustomerAccountCode,
  RecurlyCustomerAccountID,
  RecurlyItemID,
  RecurlyPlanAddOnID,
  RecurlyPlanID,
  RecurlySubscriptionID,
  UserID,
  Username,
  WishID,
} from "@milkshakechat/helpers";

const run = async () => {
  console.log(`Running script recurly sandbox...`);
  await initFirebase();
  await initRecurly();
  // await createRecurlyPlan({
  //   userID: "iF9ZcmR4ZdWcWrH3ChICwFhYVqX2" as UserID,
  //   username: "johnnymacro" as Username,
  // });
  // await getRecurlyPlan({
  //   // planId: "tb7ay9d0zoxp" as RecurlyPlanID,
  //   planCode: "if9zcmr4zdwcwrh3chicwfhyvqx2",
  // });
  // const userID = "iF9ZcmR4ZdWcWrH3ChICwFhYVqX2" as UserID;
  // await createRecurlyCustomer(userID);
  // await getRecurlyCustomer({
  //   accountCode: "iF9ZcmR4ZdWcWrH3ChICwFhYVqX2",
  // });
  // const planID = "tb7ay9d0zoxp" as RecurlyPlanID;
  // const accountCode =
  //   "iF9ZcmR4ZdWcWrH3ChICwFhYVqX2" as RecurlyCustomerAccountCode;
  // await createRecurlySubscription({ planID, accountCode });
  // const subscriptionID = "tb6tu11317rr";

  // await getRecurlySubscription({
  //   // subscriptionID: "tb6tu11317rr" as RecurlySubscriptionID,
  //   subscriptionUUID: "6b12f380864d1a6d894c7f4aac9a93f6",
  // });

  // const userID = "tb6ptwb1foxp" as RecurlyCustomerAccountID;
  // const tokenID = "u4woZ7_yMGhX8Pz8pWlAGg";
  // await addPaymentMethodToRecurlyCustomer({
  //   accountID: userID,
  //   tokenID,
  // });

  // await createRecurlyItem({
  //   userID: "iF9ZcmR4ZdWcWrH3ChICwFhYVqX2" as UserID,
  //   wishID: "53b96a17-181b-41af-aff6-eb7a2b8fee4d" as WishID,
  // });

  // const recurlyItemID = "tb7lszapk0p2"
  // const planAddOnID = "tb7u3lynqg60"
  // await createRecurlyPlanAddOn({
  //   planID: "tb7ay9d0zoxp" as RecurlyPlanID,
  //   customTitle: "Speed Dating Night",
  //   customBilledAmount: 240,
  //   purchaseManifestID: uuidv4() as PurchaseMainfestID,
  // });

  // await listRecurlyPlanAddOns({
  //   planID: "tb7ay9d0zoxp" as RecurlyPlanID,
  // });

  await appendRecurlySubscriptionAddOn({
    subscriptionID: "tb6tu11317rr" as RecurlySubscriptionID,
    planAddOnCode:
      "PM_c66d937d-ef36-4595-9383-1a7c26142340" as RecurlyPlanAddOnID,
  });
};
run();
