export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "WatchStoryPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Okay" },
  { key: "____", text: "Transaction Pending" },
  {
    key: "____",
    text: "Check your notifications in a minute to see confirmation of your transaction.",
  },
  { key: "____", text: "Story is still processing. Check back later." },
  { key: "____", text: "Go Back" },
  { key: "____", text: "Posted" },
  { key: "____", text: "Share Story" },
  { key: "____", text: "Report Chat" },
  { key: "____", text: "Story link copied to clipboard!" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
