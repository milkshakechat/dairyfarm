
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "OfflineBanner";
  const phrases: PhraseSet[] = [
  { key: "_txt_youAreCurrentlyOffline_ace", text: "You are currently offline" },
{ key: "_txt_dismiss_a55", text: "Dismiss" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  