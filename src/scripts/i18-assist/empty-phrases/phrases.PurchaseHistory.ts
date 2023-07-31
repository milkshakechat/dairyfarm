export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "PurchaseHistory";
const phrases: PhraseSet[] = [
  { key: "____", text: "Stopped" },
  { key: "____", text: "Stop" },
  { key: "____", text: "Search transactions" },
  { key: "____", text: "Load More" },
  { key: "____", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
