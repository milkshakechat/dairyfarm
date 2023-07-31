export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "ProfilePage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Timeline" },
  { key: "____", text: "Wishlist" },
  { key: "____", text: "Upgrade to Premium for VIP benefits" },
  { key: "____", text: "View" },
  { key: "____", text: "Add me on Milkshake.Club" },
  { key: "____", text: "Copied profile link!" },
  { key: "____", text: "Copy" },
  { key: "____", text: "Close" },
  { key: "____", text: "Hidden profiles can't be found by username" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
