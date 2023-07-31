export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "ReturnTransaction";
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
  { key: "____", text: "Return Cookies?" },
  { key: "____", text: "Cancel" },
  { key: "____", text: "Return Cookies" },
  { key: "____", text: "Note" },
  { key: "____", text: "Add a note to your return" },
  { key: "____", text: "Save" },
  { key: "____", text: "You can no longer return these " },
  {
    key: "____",
    text: " cookies as the transaction is finalized after 90 days.",
  },
  { key: "____", text: "Are you sure you want to return " },
  {
    key: "____",
    text: " cookies? The other person will be notified of your cookie return.",
  },
  { key: "____", text: "Transaction is final " },
  { key: "____", text: "New Account Balance" },
  { key: "____", text: "RETURN COOKIES" },
  { key: "____", text: "Past Protection" },
  { key: "____", text: "Cancel" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
