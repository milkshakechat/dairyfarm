export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "TransactionHistory";
const phrases: PhraseSet[] = [
  { key: "____", text: "Pending" },
  { key: "____", text: "Recalled" },
  { key: "____", text: "Returned" },
  { key: "____", text: "Withdrawn" },
  { key: "____", text: "Recall" },
  { key: "____", text: "Return" },
  { key: "____", text: "Withdraw" },
  { key: "____", text: "Load More" },
  { key: "____", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
