export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "ChatsPage";
const phrases: PhraseSet[] = [
  { key: "explainEnablePush", text: "Please enable push notifications" },
  { key: "labelSettings", text: "Settings" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
