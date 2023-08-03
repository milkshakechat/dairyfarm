
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
  { key: "_txt_search_a91", text: "Search" },
{ key: "_txt_newWish_568", text: "New Wish" },
{ key: "_txt_edit_659", text: "Edit" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  