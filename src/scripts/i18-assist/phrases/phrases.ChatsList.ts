
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "ChatsList";
  const phrases: PhraseSet[] = [
  { key: "_txt_others_71d", text: "others" },
{ key: "_txt_searchChats_272", text: "Search Chats" },
{ key: "_txt_newChat_8ae", text: "New Chat" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  