export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "QuickChat";
const phrases: PhraseSet[] = [
  { key: "____", text: "View Chat" },
  { key: "____", text: "You do not have enough cookies in your wallet." },
  { key: "____", text: "Click here to buy cookies." },
  { key: "____", text: "Send a message" },
  { key: "____", text: "90 Days Protection" },
  { key: "____", text: "Cancel" },
  { key: "____", text: "Send a message" },
  { key: "____", text: "Type a message..." },
  { key: "____", text: "Gift a custom amount" },
  { key: "____", text: "Save" },
  { key: "____", text: "Give her a cookie?" },
  { key: "____", text: "Suggest" },
  { key: "____", text: "Balance" },
  { key: "____", text: "Are you sure you want to gift " },
  { key: "____", text: " cookies to " },
  {
    key: "____",
    text: "Milkshake protects you while online dating with 100% refunds within 90 days.",
  },
  { key: "____", text: "SEND MESSAGE" },
  { key: "____", text: "Cancel" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
