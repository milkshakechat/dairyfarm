export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "RecallTransaction";
const phrases: PhraseSet[] = [
  { key: "____", text: "Past Protection" },
  { key: "____", text: "Final" },
  { key: "____", text: "Okay" },
  { key: "____", text: "Transaction Pending" },
  {
    key: "____",
    text: "Check your notifications in a minute to see confirmation of your transaction.",
  },
  { key: "____", text: "Finalized" },
  { key: "____", text: "Recall Cookies?" },
  { key: "____", text: "Cancel" },
  { key: "____", text: "Recall Cookies" },
  { key: "____", text: "Note" },
  { key: "____", text: "Add a note to your recall" },
  { key: "____", text: "Save" },
  { key: "____", text: "You can no longer recall these " },
  {
    key: "____",
    text: " cookies as you are already past the 90 days of refund protection",
  },
  { key: "____", text: "Are you sure you want to recall " },
  {
    key: "____",
    text: " cookies? The other person will be notified of your cookie recall.",
  },
  {
    key: "____",
    text: "Milkshake protects you with 100% refunds within 90 days of online dating. Protection ends: ",
  },
  { key: "____", text: "New Account Balance" },
  { key: "____", text: "Final" },
  { key: "____", text: "RECALL COOKIES" },
  { key: "____", text: "Past Protection" },
  { key: "____", text: "Cancel" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
