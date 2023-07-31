export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "UserPublicPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Hidden Profile" },
  { key: "____", text: "Private Profile" },
  { key: "____", text: "Public Profile" },
  { key: "____", text: "Message" },
  { key: "____", text: "Create Account" },
  { key: "____", text: "No User Found" },
  { key: "____", text: "Join the Party" },
  { key: "____", text: "JOIN" },
  { key: "____", text: "LOGIN" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
