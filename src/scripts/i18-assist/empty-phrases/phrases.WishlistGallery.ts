export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "WishlistGallery";
const phrases: PhraseSet[] = [
  { key: "____", text: "Search" },
  { key: "____", text: "New Wish" },
  { key: "____", text: "Edit" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
