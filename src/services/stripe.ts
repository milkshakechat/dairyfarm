import { getStripeSecret } from "@/utils/secrets";
import Stripe from "stripe";

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
    email: "customer2@example.com",
  });
  console.log("customer", customer);
};
