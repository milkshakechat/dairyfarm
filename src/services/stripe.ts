import { getStripeSecret } from "@/utils/secrets";
import Stripe from "stripe";
import config from "@/config.env";
import {
  FirestoreCollection,
  StripeCustomerID,
  StripeMerchantID,
  UserID,
  User_Firestore,
  WalletID,
  Wallet_Firestore,
} from "@milkshakechat/helpers";
import { getFirestoreDoc, updateFirestoreDoc } from "./firestore";

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

export const createBuyIntent = async ({
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
  // check that they dont already have a stripe account
  const existingWallet = await getFirestoreDoc<WalletID, Wallet_Firestore>({
    id: user.mainWalletID,
    collection: FirestoreCollection.WALLETS,
  });
  if (existingWallet.stripeMerchantID) {
    throw new Error(
      `User ${userID} already has a stripe account ${existingWallet.stripeMerchantID}. It is linked to wallet ${user.mainWalletID}`
    );
  }
  // only allow if user has merchant privilege
  if (!existingWallet.hasMerchantPrivilege) {
    throw new Error(
      `Wallet ${user.mainWalletID} does not have merchant privilege. It is linked to user ${userID}`
    );
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
  await updateFirestoreDoc<WalletID, Wallet_Firestore>({
    id: user.mainWalletID,
    payload: {
      stripeMerchantID: STRIPE_CONNECTED_ACCOUNT_ID as StripeMerchantID,
    },
    collection: FirestoreCollection.WALLETS,
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
  walletID: WalletID;
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
  // get their stripe account from wallet schema
  const existingWallet = await getFirestoreDoc<WalletID, Wallet_Firestore>({
    id: user.mainWalletID,
    collection: FirestoreCollection.WALLETS,
  });
  if (!existingWallet || !existingWallet.stripeMerchantID) {
    console.log(
      `User ${userID} does not have a stripe account. It is linked to wallet ${user.mainWalletID}`
    );
    return {
      userID: userID,
      walletID: user.mainWalletID,
      name: "",
      email: "",
      hasMerchantPrivilege: existingWallet.hasMerchantPrivilege,
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
    existingWallet.stripeMerchantID
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
      account: existingWallet.stripeMerchantID,
      refresh_url: config.STRIPE.merchantOnboardingFailureUrl,
      return_url: config.STRIPE.merchantOnboardingSuccessUrl,
      type: "account_onboarding",
    });

    registrationUrl = accountLink.url;
  }
  const summary: MerchantOnboardingStatusSummary = {
    userID,
    walletID: user.mainWalletID,
    name: account.business_profile?.name || `Milkshake Merchant User ${userID}`,
    email: account.email || "",
    hasMerchantPrivilege: existingWallet.hasMerchantPrivilege,
    stripeMerchantID: existingWallet.stripeMerchantID,
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
