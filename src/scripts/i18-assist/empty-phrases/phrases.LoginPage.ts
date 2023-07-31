export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "LoginPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Email" },
  { key: "____", text: "Password" },
  { key: "____", text: "LOGIN" },
  { key: "____", text: "Phone Login" },
  { key: "____", text: "Check SMS Code sent to" },
  { key: "____", text: "Code" },
  { key: "____", text: "Phone" },
  { key: "____", text: "VERIFY" },
  { key: "____", text: "reset" },
  { key: "____", text: "LOGIN PHONE" },
  { key: "____", text: "New User" },
  { key: "____", text: "Email Login" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
