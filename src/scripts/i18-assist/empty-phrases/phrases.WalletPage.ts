export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "WalletPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Main Wallet" },
  { key: "____", text: "Holding Wallet" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
