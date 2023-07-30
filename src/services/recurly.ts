import { getRecurlySecret } from "@/utils/secrets";
import {
  FirestoreCollection,
  PurchaseMainfestID,
  RecurlyCustomerAccountCode,
  RecurlyCustomerAccountID,
  RecurlyItemID,
  RecurlyPlanAddOnCode,
  RecurlyPlanAddOnID,
  RecurlyPlanID,
  RecurlySubscriptionID,
  UserID,
  Username,
  WishID,
  Wish_Firestore,
} from "@milkshakechat/helpers";
import axios from "axios";

import recurly from "recurly";
import { getFirestoreDoc } from "./firestore";
import { v4 as uuidv4 } from "uuid";

export let RecurlyClient: recurly.Client;

export const initRecurly = async () => {
  if (RecurlyClient) return RecurlyClient;
  const token = await getRecurlySecret();
  RecurlyClient = new recurly.Client(token);
  return RecurlyClient;
};

export const createRecurlyItem = async ({
  userID,
  wishID,
}: {
  userID: UserID;
  wishID: WishID;
}) => {
  try {
    const wish = await getFirestoreDoc<WishID, Wish_Firestore>({
      id: wishID,
      collection: FirestoreCollection.WISH,
    });
    const itemCreate = {
      code: wishID,
      name: wish.wishTitle,
      description: `Wish from User ${userID}`,
    };
    const item = await RecurlyClient.createItem(itemCreate);
    console.log("Created Item: ", item);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const createRecurlyPlan = async ({
  userID,
  username,
}: {
  userID: UserID;
  username: Username;
}) => {
  console.log("Creating Recurly Plan...");
  // const payload = {
  //   code: "milkshake-main-billing-cycle",
  //   name: "Milkshake Main Billing Cycle",
  //   trialUnit: "months",
  //   trialLength: 120,
  //   trialRequiresBillingInfo: false,
  //   currencies: [
  //     {
  //       currency: "USD",
  //       unitAmount: 0,
  //     },
  //   ],
  // };
  const payload = {
    code: `${userID}`,
    name: `Subscribe - @${username}`,
    trialUnit: "months",
    trialLength: 120,
    trialRequiresBillingInfo: false,
    intervalUnit: "months",
    intervalLength: 1,
    currencies: [
      {
        currency: "USD",
        unitAmount: 0,
      },
    ],
  };
  const plan = await RecurlyClient.createPlan(payload);
  console.log("Created Plan: ", plan);
};

export const getRecurlyPlan = async ({
  planId,
  planCode,
}: {
  planId?: RecurlyPlanID;
  planCode?: string;
}) => {
  if (!planId && !planCode) throw new Error("Must provide planId or planCode");
  try {
    const plan = await RecurlyClient.getPlan(
      planId ? planId : `code-${planCode}`
    );
    console.log("Fetched plan: ", plan);
  } catch (err) {
    if (err instanceof recurly.errors.NotFoundError) {
      // If the request was not found, you may want to alert the user or
      // just return null
      console.log("Resource Not Found");
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const createRecurlyPlanAddOn = async ({
  planID,
  customTitle,
  customBilledAmount,
  purchaseManifestID,
}: {
  planID: RecurlyPlanID;
  customTitle: string;
  customBilledAmount: number;
  purchaseManifestID: PurchaseMainfestID;
}) => {
  try {
    const payload = {
      addOnType: "fixed",
      name: customTitle,
      code: `PM_${purchaseManifestID}`,
      currencies: [
        {
          currency: "USD",
          unitAmount: customBilledAmount,
        },
      ],
    };

    const addOn = await RecurlyClient.createPlanAddOn(planID, payload);
    console.log("Created add-on: ", addOn);
    return addOn;
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const listRecurlyPlanAddOns = async ({
  planID,
}: {
  planID: RecurlyPlanID;
}) => {
  const addOns = RecurlyClient.listPlanAddOns(planID, {
    params: { limit: 200 },
  });

  for await (const addOn of addOns.each()) {
    console.log(addOn);
  }
};

export const createRecurlyCustomer = async (userID: UserID) => {
  try {
    const accountCreate = {
      code: userID,
      firstName: `User ${userID}`,
    };
    const account = await RecurlyClient.createAccount(accountCreate);
    console.log("Created Account: ", account.code);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const addPaymentMethodToRecurlyCustomer = async ({
  accountID,
  tokenID,
}: {
  accountID: RecurlyCustomerAccountID;
  tokenID: string;
}) => {
  console.log(`addPaymentMethodToRecurlyCustomer...`);
  try {
    const billingInfoUpdate = {
      tokenId: tokenID,
    };
    const billingInfo = await RecurlyClient.updateBillingInfo(
      accountID,
      billingInfoUpdate
    );
    console.log("Updated billing info: ", billingInfo);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const getRecurlyCustomer = async ({
  accountID,
  accountCode,
}: {
  accountID?: RecurlyCustomerAccountID;
  accountCode?: RecurlyCustomerAccountCode;
}) => {
  try {
    const account = await RecurlyClient.getAccount(
      accountID ? accountID : `code-${accountCode}`
    );
    console.log("Fetched account: ", account);
  } catch (err) {
    if (err instanceof recurly.errors.NotFoundError) {
      // If the request was not found, you may want to alert the user or
      // just return null
      console.log("Resource Not Found");
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const createRecurlySubscription = async ({
  planID,
  accountCode,
}: {
  planID: RecurlyPlanID;
  accountCode: RecurlyCustomerAccountCode;
}) => {
  try {
    let subscriptionReq = {
      planId: planID,
      currency: `USD`,
      account: {
        code: accountCode,
      },
    };
    let sub = await RecurlyClient.createSubscription(subscriptionReq);
    console.log("Created subscription: ", sub);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const getRecurlySubscription = async ({
  subscriptionID,
  subscriptionUUID,
}: {
  subscriptionID?: RecurlySubscriptionID;
  subscriptionUUID?: string;
}) => {
  if (!subscriptionID && !subscriptionUUID)
    throw new Error("Must provide subscriptionID or subscriptionUUID");
  try {
    const subscription = await RecurlyClient.getSubscription(
      subscriptionID ? subscriptionID : `uuid-${subscriptionUUID}`
    );
    console.log("Fetched subscription: ", subscription);
    return subscription;
  } catch (err) {
    if (err instanceof recurly.errors.NotFoundError) {
      // If the request was not found, you may want to alert the user or
      // just return null
      console.log("Resource Not Found");
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }
};

export const appendRecurlySubscriptionAddOn = async ({
  subscriptionID,
  planAddOnCode,
}: {
  subscriptionID: RecurlySubscriptionID;
  planAddOnCode: RecurlyPlanAddOnCode;
}) => {
  // --------------- NODEJS SDK --------------- //
  try {
    const subscriptionChangeCreate = {
      timeframe: "now",
      add_ons: [
        {
          // id: "tb7modhizuik",
          code: "53b96a17-181b-41af-aff6-eb7a2b8fee4d",
          unitAmount: 399,
        },
      ],
    };
    const change = await RecurlyClient.createSubscriptionChange(
      subscriptionID,
      subscriptionChangeCreate
    );
    console.log("Created subscription change: ", change.id);
  } catch (err) {
    console.log(err);
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log("Failed validation", err.params);
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log("Unknown Error: ", err);
    }
  }

  // --------------- REST CALL --------------- //
  // const payload = {
  //   timeframe: "now",
  //   add_ons: [
  //     {
  //       code: planAddOnCode,
  //       quantity: 1,
  //       unit_amount: 1509,
  //       // add_on: "",
  //       add_on_source: "plan_add_on",
  //     },
  //   ],
  // };

  // try {
  //   const token = await getRecurlySecret();
  //   const response = await axios.post(
  //     `https://v3.recurly.com/subscriptions/${subscriptionID}/change`,
  //     payload,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/vnd.recurly.v2021-02-25",
  //         Authorization: `Basic ${btoa(token)}`,
  //       },
  //     }
  //   );
  // } catch (e: any) {
  //   console.log(e.response.data.error);
  //   console.log(e.message);
  // }
};
