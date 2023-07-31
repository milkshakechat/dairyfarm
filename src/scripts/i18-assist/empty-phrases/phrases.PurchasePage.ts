export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "PurchasePage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Subscription stopped" },
  { key: "____", text: "Help" },
  { key: "____", text: "Successful Purchase" },
  { key: "____", text: "Now go swipe some stories!" },
  { key: "____", text: "Now send them a message!" },
  { key: "____", text: "Send Message" },
  { key: "____", text: "View Reciept" },
  { key: "____", text: "Swipe Stories" },
  { key: "____", text: "View Original" },
  { key: "____", text: "Confirm unsubscribe?" },
  { key: "____", text: "Are you sure you want to cancel your subscription?" },
  { key: "____", text: "Yes" },
  { key: "____", text: "No" },
  { key: "____", text: "Stopped" },
  { key: "____", text: "Unsubscribe" },
  { key: "____", text: "Purchase #" },
  { key: "____", text: "Copied Purchase #" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
