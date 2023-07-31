
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
  { key: "_txt_okay_134", text: "Okay" },
{ key: "_txt_transactionPending_2ef", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_969", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_youHaveRefundProtection_aa2", text: "You have 100% refund protection" },
{ key: "_txt_milkshakeProtectsYouWithRefundGuaranteeForDays_ffa", text: "Milkshake protects you with 100% refund guarantee for 90 days" },
{ key: "_txt_learnMore_29f", text: "Learn More" },
{ key: "_txt_viewEvent_620", text: "View Event" },
{ key: "_txt_viewGift_d09", text: "View Gift" },
{ key: "_txt_with_350", text: "with" },
{ key: "_txt_rsvpBy_8c0", text: "RSVP by" },
{ key: "_txt_postYourFirstStory_a57", text: "Post Your First Story" },
{ key: "_txt_upload_836", text: "Upload" },
{ key: "_txt_areYouComingToMyEvent_328", text: "Are you coming to my event?" },
{ key: "_txt_viewEvent_204", text: "View Event" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  