export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "OfflineBanner";
const phrases: PhraseSet[] = [
  { key: "____", text: "You are currently offline" },
  { key: "____", text: "Dismiss" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
