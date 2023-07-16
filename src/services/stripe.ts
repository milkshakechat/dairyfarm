import { getStripeSecret } from "@/utils/secrets";
import Stripe from "stripe";
import config from "@/config.env";
import {
  FirestoreCollection,
  StripeCustomerID,
  StripeMerchantID,
  UserID,
  User_Firestore,
  WalletAliasID,
  WalletID,
  WishBuyFrequency,
  WishID,
  Wish_Firestore,
  cookieToUSD,
} from "@milkshakechat/helpers";
import { getFirestoreDoc, updateFirestoreDoc } from "./firestore";
import { v4 as uuidv4 } from "uuid";
import {
  CreatePaymentIntentInput,
  WishBuyFrequency as WishBuyFrequencyGQL,
  WishSuggest,
} from "@/graphql/types/resolvers-types";

let stripe: Stripe;

export const initStripe = async () => {
  const privateKey = await getStripeSecret();
  stripe = new Stripe(privateKey, {
    apiVersion: "2022-11-15",
  });
};

export const createCustomerStripe = async () => {
  console.log(`createCustomerStripe...`);
  const customer = await stripe.customers.create({
    email: "customer@example.com",
  });
  console.log("customer", customer);
};

/**
 * ===== Stripe Billing Cycle vs Cookies =====
 *
 * - 1. One time charge
 * - 2. Recurring charge
 *
 * 1. One time charge
 * 1a. First check Cookie Jar balance to see if that can pay it in full [cookie_jar - full_pricee]
 * 1b. If insufficient, charge the full amount to credit card [cookie_jar net zero change]
 *
 * 2. Recurring charge
 * 2. Maintain a single "Customer Subscription" at $0 (aka. MBC - Main Billing Cycle)
 * 2a. Calculate the prorated cost of subscription until MBC date. Charge that prorated amount to credit card at same time as the one-time purchases
 * 2b. Add each recurring product to the MBC for total $A aggregate price
 * 2c. At month start, charge $A aggregate price to credit card regardless of Cookie Jar balance [cookie_jar net zero change]
 *
 * In summary, for every checkout:
 * - charge credit card NOW for all one-time + prorated subscriptions
 * - charge main billing cycle LATER for full cost of subscriptions
 *
 * The customer will see 1 charge NOW, and 1 aggregated charge LATER for monthly payments
 *
 *
 * ===== Main Billing Cycle (MBC) =====
 *
 * The main billing cycle is as follows:
 * - invoice 1st day of month (for all recurring)
 * - invoice 15th day of month (for all recurring except monthly)
 *
 * when prorating subscriptions, the prorating will be to the next closest invoice (either 1st of 15th)
 * however if its a monthly sub, then it can only prorate to the invoice on 1st day of month
 *
 * This implies that there are only 3 dates in which customers credit cards will be charged:
 * - 1st day of month
 * - 15th day of month
 * - Any day if one-time purchase
 */

export const createPaymentIntentForWishes = async ({
  wishlist,
  userID,
  note = "",
}: {
  wishlist: WishSuggest[];
  userID: UserID;
  note?: string;
}) => {
  // const cardChargeID = uuidv4();
  // const [customer, ...wishes] = await Promise.all([
  //   await getFirestoreDoc<UserID, User_Firestore>({
  //     id: userID,
  //     collection: FirestoreCollection.USERS,
  //   }),
  //   ...wishlist.map(async (w) => {
  //     const wish = await getFirestoreDoc<WishID, Wish_Firestore>({
  //       id: w.wishID as WishID,
  //       collection: FirestoreCollection.WISH,
  //     });
  //     return {
  //       wish,
  //       suggestedAmount: w.suggestedAmount,
  //       suggestedFrequency: w.suggestedFrequency,
  //     };
  //   }),
  // ]);
  // const wallet = await getFirestoreDoc<WalletID, Wallet_Firestore>({
  //   id: customer.mainWalletID,
  //   collection: FirestoreCollection.WALLETS,
  // });
  // const cookieBalance = wallet.cookieBalanceSnapshot;

  // // 1. One-time charges
  // const oneTimeWishes = wishes.filter((w) => {
  //   if (w.suggestedFrequency === WishBuyFrequencyGQL.OneTime) return true;
  //   if (
  //     !w.suggestedFrequency &&
  //     w.wish.buyFrequency === WishBuyFrequency.ONE_TIME
  //   )
  //     return true;
  //   return false;
  // });
  // const totalCookiesCostForOneTimePayments = oneTimeWishes.reduce(
  //   (acc, curr) => {
  //     const { wish, suggestedAmount } = curr;
  //     const incr = suggestedAmount ? suggestedAmount : wish.cookiePrice;
  //     return acc + incr;
  //   },
  //   0
  // );

  // let oneTimeTotalUSD = 0;
  // let proratedTotalUSD = 0;

  // // spend existing cookies first for one-time charges
  // if (totalCookiesCostForOneTimePayments < cookieBalance) {
  //   // deduct from cookie jar if can pay in full
  //   // be sure to log journal entry to show how payment was made
  // } else {
  //   // else charge full amount to card
  //   const totalPriceUSD = parseInt(
  //     `${cookieToUSD(totalCookiesCostForOneTimePayments) * 100}`
  //   );
  //   oneTimeTotalUSD += totalPriceUSD;
  //   // be sure to log journal entry to show how payment was made
  // }

  // const now = new Date();
  // const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  // const daysInMonth = new Date(
  //   now.getFullYear(),
  //   now.getMonth() + 1,
  //   0
  // ).getDate();
  // const daysUntilNextCycle = Math.ceil(
  //   (nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  // );

  // // 2. Recurring Subscriptions
  // // 2a. Charge once for prorated subscriptions
  // const subscriptions = wishes.filter((w) => {
  //   if (
  //     w.suggestedFrequency &&
  //     w.suggestedFrequency !== WishBuyFrequencyGQL.OneTime
  //   )
  //     return true;
  //   if (
  //     !w.suggestedFrequency &&
  //     w.wish.buyFrequency !== WishBuyFrequency.ONE_TIME
  //   )
  //     return true;
  //   return false;
  // });
  // const prorated = subscriptions.map((sub) => {
  //   const cookies = sub.suggestedAmount || sub.wish.cookiePrice;
  //   const dailyRate = cookieToUSD(cookies) / daysInMonth;
  //   const proratedPriceUSD = Math.ceil(dailyRate * daysUntilNextCycle);
  //   proratedTotalUSD += proratedPriceUSD;
  //   return {
  //     ...sub,
  //     proratedBilled: proratedPriceUSD,
  //   };
  // });
  // const totalChargedNow = oneTimeTotalUSD + proratedTotalUSD;

  // // const totalChargedLater = prorated.map(sub => sub.suggestedAmount || sub.)
  //
  return "checkoutToken";
};

export const createPaymentIntent = async ({
  stripeCustomerID,
  amount,
  currency = "usd",
  description = "",
  recieptEmail = undefined,
}: {
  stripeCustomerID: StripeCustomerID;
  amount: number;
  currency?: string; // iso code
  description?: string;
  recieptEmail?: string;
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    customer: stripeCustomerID,
    setup_future_usage: "off_session",
    amount,
    currency,
    description,
    receipt_email: recieptEmail,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent.client_secret;
};

export const createChargeStripe = async () => {
  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  const charge = await stripe.charges.create({
    amount: 100,
    currency: "usd",
    source: "tok_mastercard",
    description:
      "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)",
  });
};

export const createMerchantOnboardingStripe = async ({
  userID,
}: {
  userID: UserID;
}) => {
  // get the user from firestore
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  if (user.stripeMetadata && user.stripeMetadata.stripeMerchantID) {
    throw new Error(
      `User ${userID} already has a stripe account ${user.stripeMetadata.stripeMerchantID}.`
    );
  }
  // only allow if user has merchant privilege
  if (user.stripeMetadata && user.stripeMetadata?.hasMerchantPrivilege) {
    throw new Error(`User ${user.id} does not have merchant privilege`);
  }
  // if new, proceed to create the stripe connect account for merchant

  const account = await stripe.accounts.create({
    type: "express",
  });
  const STRIPE_CONNECTED_ACCOUNT_ID = account.id;

  let registrationUrl: string | undefined;
  try {
    // attempt to generate account onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: STRIPE_CONNECTED_ACCOUNT_ID,
      refresh_url: config.STRIPE.merchantOnboardingFailureUrl,
      return_url: config.STRIPE.merchantOnboardingSuccessUrl,
      type: "account_onboarding",
    });

    registrationUrl = accountLink.url;
  } catch (e) {
    console.log(e);
  }
  // Update the users Milkshake wallet with the associated stripe connect account
  await updateFirestoreDoc<UserID, User_Firestore>({
    id: user.id,
    payload: {
      stripeMetadata: {
        ...(user.stripeMetadata || { hasMerchantPrivilege: true }),
        stripeMerchantID: STRIPE_CONNECTED_ACCOUNT_ID as StripeMerchantID,
      },
    },
    collection: FirestoreCollection.USERS,
  });
  if (!registrationUrl) {
    throw new Error(
      `Failed to generate stripe account onboarding link for milkshake user ${userID} (stripe user ${STRIPE_CONNECTED_ACCOUNT_ID})`
    );
  }
  return registrationUrl;
};

interface MerchantOnboardingStatusSummary {
  userID: UserID;
  tradingWallet: WalletAliasID;
  escrowWallet: WalletAliasID;
  name: string;
  email: string;
  hasMerchantPrivilege: boolean;
  stripeMerchantID?: StripeMerchantID;
  stripePortalUrl?: string;
  anythingDue: boolean;
  anythingErrors: boolean;
  capabilities: {
    card_payments: Stripe.Account.Capabilities.CardPayments | undefined;
    transfers: Stripe.Account.Capabilities.Transfers | undefined;
    charges_enabled: boolean;
    payouts_enabled: boolean;
  };
}
export const checkMerchantOnboardingStatus = async ({
  userID,
  getControlPanel = false,
}: {
  userID: UserID;
  getControlPanel?: boolean;
}): Promise<MerchantOnboardingStatusSummary> => {
  // get the user from firestore
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  if (!user.stripeMetadata || !user.stripeMetadata.stripeMerchantID) {
    console.log(`User ${userID} does not have a stripe account.`);
    return {
      userID: userID,
      tradingWallet: user.tradingWallet,
      escrowWallet: user.escrowWallet,
      name: "",
      email: "",
      hasMerchantPrivilege: user.stripeMetadata?.hasMerchantPrivilege || false,
      anythingDue: false,
      anythingErrors: false,
      capabilities: {
        card_payments: undefined,
        transfers: undefined,
        charges_enabled: false,
        payouts_enabled: false,
      },
    };
  }
  const account = await stripe.accounts.retrieve(
    user.stripeMetadata.stripeMerchantID
  );
  const anythingCurrentlyDue =
    account.requirements &&
    account.requirements.currently_due &&
    account.requirements.currently_due.length > 0
      ? true
      : false;
  const anythingCurrentlyDeadline =
    account.requirements && account.requirements.current_deadline
      ? true
      : false;
  const anythingPastDue =
    account.requirements &&
    account.requirements.past_due &&
    account.requirements.past_due.length > 0
      ? true
      : false;
  const anythingDisabledReason =
    account.requirements && account.requirements.disabled_reason ? true : false;
  const anythingEventuallyDue =
    account.requirements &&
    account.requirements.eventually_due &&
    account.requirements.eventually_due.length > 0
      ? true
      : false;
  const anythingErrs =
    account.requirements &&
    account.requirements.errors &&
    account.requirements.errors.length > 0
      ? true
      : false;
  const anythingDue =
    anythingCurrentlyDue || anythingPastDue || anythingEventuallyDue;
  const anythingErrors =
    anythingErrs || anythingDisabledReason || anythingCurrentlyDeadline;
  let registrationUrl: string | undefined;
  if (getControlPanel || anythingDue || anythingErrors) {
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeMetadata.stripeMerchantID,
      refresh_url: config.STRIPE.merchantOnboardingFailureUrl,
      return_url: config.STRIPE.merchantOnboardingSuccessUrl,
      type: "account_onboarding",
    });

    registrationUrl = accountLink.url;
  }
  const summary: MerchantOnboardingStatusSummary = {
    userID,
    tradingWallet: user.tradingWallet,
    escrowWallet: user.escrowWallet,
    name: account.business_profile?.name || `Milkshake Merchant User ${userID}`,
    email: account.email || "",
    hasMerchantPrivilege: user.stripeMetadata.hasMerchantPrivilege,
    stripeMerchantID: user.stripeMetadata.stripeMerchantID,
    stripePortalUrl: registrationUrl,
    anythingDue,
    anythingErrors,
    capabilities: {
      card_payments: account.capabilities?.card_payments,
      transfers: account.capabilities?.transfers,
      charges_enabled: account.charges_enabled || false,
      payouts_enabled: account.payouts_enabled || false,
    },
  };
  return summary;
};

export const createEmptySubscriptionStripe = async () => {
  console.log("createEmptySubscriptionStripe...");
  const product = await stripe.products.create({
    name: "Milkshake Subscription - Monthly Main Billing Cycle",
    type: "service",
  });
  console.log("product", product);
  const price = await stripe.prices.create({
    unit_amount: 0,
    currency: "usd",
    recurring: { interval: "month" },
    product: product.id,
  });
  console.log("price", price);
  return { product, price };
};
