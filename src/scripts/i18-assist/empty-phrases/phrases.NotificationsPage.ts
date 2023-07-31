export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "NotificationsPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Notifications" },
  { key: "____", text: "Mark all as read?" },
  { key: "____", text: "Yes" },
  { key: "____", text: "No" },
  { key: "____", text: "Load More" },
  { key: "____", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
