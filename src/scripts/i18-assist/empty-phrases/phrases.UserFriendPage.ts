export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "UserFriendPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Friend Request Sent" },
  { key: "____", text: "Timeline" },
  { key: "____", text: "Wishlist" },
  { key: "____", text: "Message" },
  { key: "____", text: "Share" },
  { key: "____", text: "Remove" },
  { key: "____", text: "Block" },
  { key: "____", text: "Chat" },
  { key: "____", text: "Add Friend" },
  { key: "____", text: "Okay" },
  { key: "____", text: "Transaction Pending" },
  {
    key: "____",
    text: "Check your notifications in a minute to see confirmation of your transaction.",
  },
  { key: "____", text: "No User Found" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
