import { getStripeSecret, getXCloudAWSSecret } from "@/utils/secrets";
import Stripe from "stripe";
import config from "@/config.env";
import {
  CardChargeID,
  FirestoreCollection,
  GetWalletXCloudRequestBody,
  GetWalletXCloudResponseBody,
  PostTransactionXCloudRequestBody,
  PurchaseMainfestID,
  PurchaseMainfest_Firestore,
  StripeCustomerID,
  StripeMerchantID,
  StripePriceID,
  StripeProductID,
  StripeSubscriptionID,
  TransactionType,
  TxRefID,
  UserID,
  User_Firestore,
  WalletAliasID,
  WalletID,
  WishBuyFrequency,
  WishID,
  Wish_Firestore,
  cookieToUSD,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  updateFirestoreDoc,
} from "./firestore";
import { v4 as uuidv4 } from "uuid";
import {
  CreatePaymentIntentInput,
  WishBuyFrequency as WishBuyFrequencyGQL,
  WishSuggest,
} from "@/graphql/types/resolvers-types";
import axios from "axios";
import { _postTransaction } from "./quantum";

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

export const createPaymentIntentForWish = async ({
  wishSuggest,
  userID,
  note = "",
  attribution = "",
  promoCode = "",
}: {
  wishSuggest: WishSuggest;
  userID: UserID;
  note?: string;
  attribution?: string;
  promoCode?: string;
}) => {
  console.log(`createPaymentIntentForWish...`);
  const referenceID = uuidv4() as TxRefID;
  const [customer, wish] = await Promise.all([
    await getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    await getFirestoreDoc<WishID, Wish_Firestore>({
      id: wishSuggest.wishID as WishID,
      collection: FirestoreCollection.WISH,
    }),
  ]);
  const seller = await getFirestoreDoc<UserID, User_Firestore>({
    id: wish.creatorID,
    collection: FirestoreCollection.USERS,
  });
  const xcloudSecret = await getXCloudAWSSecret();
  const params: GetWalletXCloudRequestBody = {
    walletAliasID: customer.tradingWallet,
  };

  const { data }: { data: GetWalletXCloudResponseBody } = await axios.get(
    config.WALLET_GATEWAY.getWallet.url,
    {
      params: {
        walletAliasID: params.walletAliasID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: xcloudSecret,
      },
    }
  );
  const { wallet: tradingWallet } = data;
  console.log(`---- tradingWallet`);
  console.log(tradingWallet);
  const cookieBalance = tradingWallet.balance;
  console.log(`---- cookieBalance ${cookieBalance}`);

  const price = wishSuggest.suggestedAmount || wish.cookiePrice;
  const frequency = wishSuggest.suggestedFrequency
    ? (wishSuggest.suggestedFrequency as unknown as WishBuyFrequency)
    : wish.buyFrequency;
  const desc = `@${customer.username} paid ${price} cookies ${frequency} for "${wish.wishTitle}" from @${seller.username}. Original terms were ${wish.cookiePrice} cookies ${wish.buyFrequency}. BuyerUserID=${customer.id} and SellerUserID=${seller.id}.`;
  console.log(desc);

  const { purchaseManifest, stripePrice } = await createPurchaseManifest({
    note: desc,
    wishID: wish.id,
    buyerUserID: userID,
    sellerUserID: wish.creatorID,
    buyerWallet: customer.tradingWallet,
    escrowWallet: seller.escrowWallet,
    agreedCookiePrice: price,
    originalCookiePrice: wish.cookiePrice,
    agreedBuyFrequency: frequency,
    originalBuyFrequency: wish.buyFrequency,
    stripeProductID: wish.stripeProductID,
    referenceID,
  });

  //  1. One-time charges
  const totalCookiesCostForOneTimePayments =
    frequency === WishBuyFrequency.ONE_TIME ? price : 0;
  console.log(
    `totalCookiesCostForOneTimePayments=${totalCookiesCostForOneTimePayments}`
  );

  // spend existing cookies first for one-time charges
  if (
    frequency === WishBuyFrequency.ONE_TIME &&
    totalCookiesCostForOneTimePayments < cookieBalance
  ) {
    console.log(
      `you have enough money! totalCookiesCostForOneTimePayment=${totalCookiesCostForOneTimePayments} < cookieBalance=${cookieBalance}`
    );
    // deduct from cookie jar if can pay in full
    // be sure to log journal entry to show how payment was made

    const transaction: PostTransactionXCloudRequestBody = {
      title: `@${customer.username} bought "${wish.wishTitle}" for ${totalCookiesCostForOneTimePayments} cookies from @${seller.username}`,
      note: desc,
      purchaseManifestID: purchaseManifest.id,
      attribution,
      type: TransactionType.DEAL,
      amount: totalCookiesCostForOneTimePayments,
      senderWallet: customer.tradingWallet,
      senderUserID: customer.id,
      receiverWallet: seller.escrowWallet,
      receiverUserID: seller.id,
      explanations: [
        {
          walletAliasID: seller.escrowWallet,
          explanation: `Sold "${wish.wishTitle}" for ${totalCookiesCostForOneTimePayments} cookies from @${customer.username}`,
          amount: totalCookiesCostForOneTimePayments,
        },
        {
          walletAliasID: customer.tradingWallet,
          explanation: `Bought "${wish.wishTitle}" for ${totalCookiesCostForOneTimePayments} cookies from @${seller.username}`,
          amount: -totalCookiesCostForOneTimePayments,
        },
      ],
      gotRecalled: false,
      salesMetadata: {
        buyerNote: note,
        promoCode,
        agreedCookiePrice: totalCookiesCostForOneTimePayments,
        originalCookiePrice: wish.cookiePrice,
        agreedBuyFrequency: frequency,
        originalBuyFrequency: wish.buyFrequency,
      },
      referenceID,
    };
    _postTransaction(transaction);
    return {
      checkoutToken: null,
      referenceID,
    };
  } else if (
    frequency === WishBuyFrequency.ONE_TIME &&
    totalCookiesCostForOneTimePayments > cookieBalance
  ) {
    console.log("not enough money in wallet, so billing credit card");
    const totalPriceUSD = parseInt(
      `${cookieToUSD(totalCookiesCostForOneTimePayments) * 100}`
    );
    // charge card on "totalPriceUSD"
    console.log(
      `customer.stripeMetadata.stripeCustomerID`,
      customer.stripeMetadata?.stripeCustomerID
    );
    if (customer.stripeMetadata && customer.stripeMetadata.stripeCustomerID) {
      const checkoutToken = await createPaymentIntentStripe({
        stripeCustomerID: customer.stripeMetadata.stripeCustomerID,
        amount: totalPriceUSD,
        description: desc,
        recieptEmail: customer.email,
      });
      // post transaction for cookie jar topup
      // post transaction for sale
      return {
        checkoutToken,
        referenceID,
      };
    } else {
      throw Error("No Stripe customer on file");
    }
  } else if (
    frequency === WishBuyFrequency.DAILY ||
    frequency === WishBuyFrequency.WEEKLY ||
    frequency === WishBuyFrequency.MONTHLY
  ) {
    console.log(`This is a recurring subscription`);
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const daysUntilNextCycle = Math.ceil(
      (nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log(`daysUntilNextCycle=${daysUntilNextCycle}`);
    // 2. Recurring Subscriptions
    // 2a. Charge once for prorated subscriptions

    const subscriptionPrice = wishSuggest.suggestedAmount || wish.cookiePrice;
    const dailyRate = cookieToUSD(subscriptionPrice) / daysInMonth;

    const totalChargedNowSub = Math.ceil(dailyRate * daysUntilNextCycle);
    console.log(`totalChargedNowSub=${totalChargedNowSub}`);

    // charge card on "subscriptionPrice"
    // add to subscription on "totalChargedLaterSub"
    if (customer.stripeMetadata && customer.stripeMetadata.stripeCustomerID) {
      const checkoutToken = await createPaymentIntentStripe({
        stripeCustomerID: customer.stripeMetadata.stripeCustomerID,
        amount: totalChargedNowSub,
        description: desc,
        recieptEmail: customer.email,
      });
      // post transaction for cookie jar topup
      // post transaction for sale
      if (customer.stripeMetadata.stripeCustomerSubscriptionID && stripePrice) {
        await addItemToMainBillingCycle({
          subscriptionID: customer.stripeMetadata.stripeCustomerSubscriptionID,
          stripePrice,
        });
      }
      return {
        checkoutToken,
        referenceID,
      };
    } else {
      throw Error("No Stripe customer on file");
    }
  } else {
    throw Error("Issue creating payment intent. Insufficient data");
  }
};

export const createPaymentIntentStripe = async ({
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
  console.log(`createPaymentIntentStripe...`);
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
  console.log(`paymentIntent`, paymentIntent);
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

export const createPurchaseManifest = async (args: {
  note: string;
  wishID: WishID;
  buyerUserID: UserID;
  sellerUserID: UserID;
  buyerWallet: WalletAliasID;
  escrowWallet: WalletAliasID;
  agreedCookiePrice: number;
  originalCookiePrice: number;
  agreedBuyFrequency: WishBuyFrequency;
  originalBuyFrequency: WishBuyFrequency;
  stripeProductID?: StripeProductID;
  referenceID: TxRefID;
}) => {
  console.log("createPurchaseManifest...");
  console.log(`stripeProductID = ${args.stripeProductID}`);
  const {
    note,
    wishID,
    buyerUserID,
    sellerUserID,
    buyerWallet,
    escrowWallet,
    agreedCookiePrice,
    originalCookiePrice,
    agreedBuyFrequency,
    originalBuyFrequency,
    stripeProductID,
  } = args;
  const id = uuidv4() as PurchaseMainfestID;
  const totalPriceUSD = parseInt(`${cookieToUSD(agreedCookiePrice) * 100}`);
  const priceUSDBasisAsMonthly = convertFrequencySubscriptionToMonthly({
    amount: totalPriceUSD,
    frequency: agreedBuyFrequency,
  });
  const priceCookieAsMonthly = convertFrequencySubscriptionToMonthly({
    amount: agreedCookiePrice,
    frequency: agreedBuyFrequency,
  });
  const stripePrice = stripeProductID
    ? await createStripeProductPrice({
        stripeProductID,
        frequency: agreedBuyFrequency,
        wishID: wishID,
        purchaseManifestID: id,
        referenceID: args.referenceID,
        priceUSDBasisAsMonthly,
        priceCookieAsMonthly,
        cookiesPerFrequency: agreedCookiePrice,
      })
    : undefined;
  console.log(`stripePrice`, stripePrice);
  const manifest: PurchaseMainfest_Firestore = {
    // basic info
    id,
    note,
    createdAt: createFirestoreTimestamp(),
    wishID,
    // foriegn keys
    buyerUserID,
    sellerUserID,
    // foreign keys
    buyerWallet,
    escrowWallet,
    // payment
    paymentComplete: false,
    referenceID: args.referenceID,
    // wish details
    agreedCookiePrice,
    originalCookiePrice,
    // subscription details
    agreedBuyFrequency,
    originalBuyFrequency,
    // recall
    isCancelled: false,
    // stripe
    stripeProductID,
    stripePriceID: stripePrice ? (stripePrice.id as StripePriceID) : undefined,
    priceUSDPerFrequency: totalPriceUSD,
    priceCookiePerFrequency: agreedCookiePrice,
    priceUSDBasisAsMonthly,
    priceCookieAsMonthly,
  };
  const purchaseManifest = await createFirestoreDoc<
    PurchaseMainfestID,
    PurchaseMainfest_Firestore
  >({
    id,
    data: manifest,
    collection: FirestoreCollection.PURCHASE_MANIFESTS,
  });
  return { purchaseManifest, stripePrice };
};

export const convertFrequencySubscriptionToMonthly = (args: {
  amount: number;
  frequency: WishBuyFrequency;
}) => {
  // convert freqencies to monthly equivalent
  const { amount, frequency } = args;
  let monthlyAmount = 0;
  switch (frequency) {
    case WishBuyFrequency.DAILY:
      monthlyAmount = amount * 30;
      break;
    case WishBuyFrequency.WEEKLY:
      monthlyAmount = amount * 4.3;
      break;
    case WishBuyFrequency.MONTHLY:
      monthlyAmount = amount;
      break;
    default:
      throw Error(`Invalid frequency ${frequency}`);
  }
  return monthlyAmount;
};

export const createStripeProduct = async (args: { wishID: WishID }) => {
  const product = await stripe.products.create({
    name: args.wishID,
    type: "service",
  });
  return product;
};
export const createStripeProductPrice = async (args: {
  stripeProductID: StripeProductID;
  priceUSDBasisAsMonthly: number;
  priceCookieAsMonthly: number;
  wishID: WishID;
  purchaseManifestID: PurchaseMainfestID;
  cookiesPerFrequency: number;
  frequency: WishBuyFrequency;
  referenceID: TxRefID;
}) => {
  console.log(`args.frequency = ${args.frequency}`);
  // Create price for the new product
  const price = await stripe.prices.create({
    unit_amount: args.priceUSDBasisAsMonthly, // amount in cents
    currency: "usd",
    recurring: { interval: "month" },
    product: args.stripeProductID,
    metadata: {
      wishID: args.wishID,
      purchaseManifestID: args.purchaseManifestID,
      cookiesPerFrequency: args.cookiesPerFrequency,
      frequency: args.frequency,
      priceCookieAsMonthly: args.priceCookieAsMonthly,
      referenceID: args.referenceID,
    },
  });
  return price;
};
export const addItemToMainBillingCycle = async (args: {
  subscriptionID: StripeSubscriptionID;
  stripePrice: Stripe.Price;
}) => {
  console.log("addItemToMainBillingCycle...");
  console.log(
    `args.subscriptionID=${args.subscriptionID} with price ${args.stripePrice.id} at unit_amount=${args.stripePrice.unit_amount} ${args.stripePrice.currency} per ${args.stripePrice.recurring?.interval}}`
  );
  // Add a new subscription item with the new price to the subscription
  const subscriptionItem = await stripe.subscriptionItems.create({
    subscription: args.subscriptionID,
    price: args.stripePrice.id,
    quantity: 1,
  });
  console.log("subscriptionItem", subscriptionItem);
  return subscriptionItem;
};
