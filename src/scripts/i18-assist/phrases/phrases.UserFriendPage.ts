
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
  { key: "_txt_friendRequestSent_762", text: "Friend Request Sent" },
{ key: "_txt_timeline_88f", text: "Timeline" },
{ key: "_txt_wishlist_981", text: "Wishlist" },
{ key: "_txt_message_d4f", text: "Message" },
{ key: "_txt_share_e80", text: "Share" },
{ key: "_txt_remove_952", text: "Remove" },
{ key: "_txt_block_c07", text: "Block" },
{ key: "_txt_chat_dd1", text: "Chat" },
{ key: "_txt_addFriend_52c", text: "Add Friend" },
{ key: "_txt_okay_917", text: "Okay" },
{ key: "_txt_transactionPending_87d", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_9cb", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_noUserFound_b32", text: "No User Found" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  