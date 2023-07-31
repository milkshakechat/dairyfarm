export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "TopUpWallet";
const phrases: PhraseSet[] = [
  { key: "____", text: "One Time Purchase" },
  { key: "____", text: "Daily Subscription" },
  { key: "____", text: "Monthly Subscription" },
  { key: "____", text: "Weekly Subscription" },
  { key: "____", text: "Failed to purchase wish" },
  { key: "____", text: "Top Up Wallet" },
  { key: "____", text: "Cancel" },
  { key: "____", text: "Enter a custom amount" },
  { key: "____", text: "Save" },
  { key: "____", text: "Add cookies to wallet" },
  { key: "____", text: "Suggest" },
  { key: "____", text: "Are you sure you want to buy " },
  {
    key: "____",
    text: " cookies to add to your wallet? Milkshake protects you while online dating with 100% refunds within 90 days.",
  },
  { key: "____", text: "Account Balance" },
  { key: "____", text: "CONFIRM PURCHASE" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
