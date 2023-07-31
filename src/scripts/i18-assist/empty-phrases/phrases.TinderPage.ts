export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "TinderPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Okay" },
  { key: "____", text: "Transaction Pending" },
  {
    key: "____",
    text: "Check your notifications in a minute to see confirmation of your transaction.",
  },
  { key: "____", text: "You have 100% refund protection" },
  {
    key: "____",
    text: "Milkshake protects you with 100% refund guarantee for 90 days",
  },
  { key: "____", text: "Learn More" },
  { key: "____", text: "View Event" },
  { key: "____", text: "View Gift" },
  { key: "____", text: "with" },
  { key: "____", text: "RSVP by" },
  { key: "____", text: "Post Your First Story" },
  { key: "____", text: "Upload" },
  { key: "____", text: "Are you coming to my event?" },
  { key: "____", text: "View Event" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
