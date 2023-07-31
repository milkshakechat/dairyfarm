export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "WishPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "One Time Purchase" },
  { key: "____", text: "Weekly Recurring" },
  { key: "____", text: "Monthly Recurring" },
  { key: "____", text: "Event" },
  { key: "____", text: "Gift" },
  { key: "____", text: "ATTEND EVENT" },
  { key: "____", text: "SUBSCRIBE EVENT" },
  { key: "____", text: "SUBSCRIBE WISH" },
  { key: "____", text: "BUY WISH" },
  { key: "____", text: "PURCHASE WISH" },
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
  { key: "____", text: "Edit" },
  { key: "____", text: "Message" },
  { key: "____", text: "Favorite" },
  { key: "____", text: "RSVP by" },
  { key: "____", text: "More Info" },
  { key: "____", text: "Unlocked Stickers" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
