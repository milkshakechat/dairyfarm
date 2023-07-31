export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "WalletPanel";
const phrases: PhraseSet[] = [
  { key: "____", text: "Transactions" },
  { key: "____", text: "Sales" },
  { key: "____", text: "Purchases" },
  { key: "____", text: "Okay" },
  { key: "____", text: "Transaction Pending" },
  {
    key: "____",
    text: "Check your notifications in a minute to see confirmation of your transaction.",
  },
  { key: "____", text: "COOKIE BALANCE" },
  { key: "____", text: "Recharge" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
