export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "ConfirmPurchase";
const phrases: PhraseSet[] = [
  { key: "____", text: "One Time Purchase" },
  { key: "____", text: "Daily Subscription" },
  { key: "____", text: "Monthly Subscription" },
  { key: "____", text: "Weekly Subscription" },
  { key: "____", text: "Failed to purchase wish" },
  { key: "____", text: "Confirm Purchase?" },
  { key: "____", text: "90 Days Protection" },
  { key: "____", text: "Cancel" },
  { key: "____", text: "Offer a custom amount" },
  { key: "____", text: "Save" },
  { key: "____", text: "Buy Wish from " },
  { key: "____", text: "Suggest" },
  { key: "____", text: "Note" },
  { key: "____", text: "One Time" },
  { key: "____", text: "Daily" },
  { key: "____", text: "Weekly" },
  { key: "____", text: "Monthly" },
  { key: "____", text: "Frequency" },
  { key: "____", text: "Add a note to your purchase" },
  { key: "____", text: "Are you sure you want to buy from " },
  {
    key: "____",
    text: "Milkshake protects you while online dating with 100% refunds within 90 days.",
  },
  { key: "____", text: "Account Balance" },
  { key: "____", text: "90 Days Protection" },
  { key: "____", text: "You will get an exclusive sticker from " },
  { key: "____", text: "CONFIRM PURCHASE" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
