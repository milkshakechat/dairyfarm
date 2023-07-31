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
  { key: "____", text: "others" },
  { key: "____", text: "Search Chats" },
  { key: "____", text: "New Chat" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
