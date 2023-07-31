
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
  { key: "_txt_okay_4d0", text: "Okay" },
{ key: "_txt_transactionPending_b74", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_ae5", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_storyIsStillProcessingCheckBackLater_8ac", text: "Story is still processing. Check back later." },
{ key: "_txt_goBack_8e2", text: "Go Back" },
{ key: "_txt_posted_7f5", text: "Posted" },
{ key: "_txt_shareStory_792", text: "Share Story" },
{ key: "_txt_reportChat_d61", text: "Report Chat" },
{ key: "_txt_storyLinkCopiedToClipboard_e5b", text: "Story link copied to clipboard!" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  