export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "MobileScreen";
const phrases: PhraseSet[] = [
  { key: "____", text: "Dating" },
  { key: "____", text: "Menu" },
  { key: "____", text: "Wishlist" },
  { key: "____", text: "Wallet" },
  { key: "____", text: "Refresh" },
  { key: "____", text: "Confirm Logout" },
  { key: "____", text: "Are you sure you want to log out?" },
  { key: "____", text: "Yes" },
  { key: "____", text: "No" },
  { key: "____", text: "Log Out" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
