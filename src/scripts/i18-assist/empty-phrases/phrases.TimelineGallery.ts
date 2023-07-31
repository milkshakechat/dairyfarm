export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "TimelineGallery";
const phrases: PhraseSet[] = [
  { key: "____", text: "Remove Pin" },
  { key: "____", text: "Pin Story" },
  { key: "____", text: "Hide Story" },
  { key: "____", text: "Show Story" },
  { key: "____", text: "Hide Hidden" },
  { key: "____", text: "Show Hidden" },
  { key: "____", text: "Post Your First Story" },
  { key: "____", text: "Upload" },
  { key: "____", text: "Nothing to see yet" },
  { key: "____", text: "Add Friend" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
