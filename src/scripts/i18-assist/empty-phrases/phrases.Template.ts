export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "_______";
const phrases: PhraseSet[] = [
  { key: "____", text: "______" },
  { key: "____", text: "______" },
  { key: "____", text: "______" },
  { key: "____", text: "______" },
  { key: "____", text: "______" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
