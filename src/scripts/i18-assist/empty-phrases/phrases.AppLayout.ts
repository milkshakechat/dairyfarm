export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "AppLayout";
const phrases: PhraseSet[] = [
  { key: "____", text: "Dating" },
  { key: "____", text: "Wallet" },
  { key: "____", text: "Log Out" },
  { key: "____", text: "Confirm Logout" },
  { key: "____", text: "Are you sure you want to log out?" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
