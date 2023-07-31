export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "AboutSection";
const phrases: PhraseSet[] = [{ key: "____", text: "Edit Profile" }];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
