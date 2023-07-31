
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "PurchasePage";
  const phrases: PhraseSet[] = [
  { key: "_txt_subscriptionStopped_4ae", text: "Subscription stopped" },
{ key: "_txt_help_58a", text: "Help" },
{ key: "_txt_successfulPurchase_b05", text: "Successful Purchase" },
{ key: "_txt_nowGoSwipeSomeStories_8f6", text: "Now go swipe some stories!" },
{ key: "_txt_nowSendThemAMessage_8df", text: "Now send them a message!" },
{ key: "_txt_sendMessage_39e", text: "Send Message" },
{ key: "_txt_viewReciept_95e", text: "View Reciept" },
{ key: "_txt_swipeStories_d3e", text: "Swipe Stories" },
{ key: "_txt_viewOriginal_723", text: "View Original" },
{ key: "_txt_confirmUnsubscribe_785", text: "Confirm unsubscribe?" },
{ key: "_txt_areYouSureYouWantToCancelYourSubscription_cef", text: "Are you sure you want to cancel your subscription?" },
{ key: "_txt_yes_172", text: "Yes" },
{ key: "_txt_no_e49", text: "No" },
{ key: "_txt_stopped_a89", text: "Stopped" },
{ key: "_txt_unsubscribe_3ed", text: "Unsubscribe" },
{ key: "_txt_purchase_f5b", text: "Purchase #" },
{ key: "_txt_copiedPurchase_71a", text: "Copied Purchase #" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  