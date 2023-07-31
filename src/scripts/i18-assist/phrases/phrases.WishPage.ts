
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
  { key: "_txt_oneTimePurchase_a95", text: "One Time Purchase" },
{ key: "_txt_weeklyRecurring_c54", text: "Weekly Recurring" },
{ key: "_txt_monthlyRecurring_1e9", text: "Monthly Recurring" },
{ key: "_txt_event_3d2", text: "Event" },
{ key: "_txt_gift_730", text: "Gift" },
{ key: "_txt_attendEvent_3bf", text: "ATTEND EVENT" },
{ key: "_txt_subscribeEvent_176", text: "SUBSCRIBE EVENT" },
{ key: "_txt_subscribeWish_102", text: "SUBSCRIBE WISH" },
{ key: "_txt_buyWish_99a", text: "BUY WISH" },
{ key: "_txt_purchaseWish_295", text: "PURCHASE WISH" },
{ key: "_txt_okay_935", text: "Okay" },
{ key: "_txt_transactionPending_a3c", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_b56", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_youHaveRefundProtection_d7a", text: "You have 100% refund protection" },
{ key: "_txt_milkshakeProtectsYouWithRefundGuaranteeForDays_a62", text: "Milkshake protects you with 100% refund guarantee for 90 days" },
{ key: "_txt_edit_19e", text: "Edit" },
{ key: "_txt_message_394", text: "Message" },
{ key: "_txt_favorite_e2c", text: "Favorite" },
{ key: "_txt_rsvpBy_7e4", text: "RSVP by" },
{ key: "_txt_moreInfo_aa2", text: "More Info" },
{ key: "_txt_unlockedStickers_695", text: "Unlocked Stickers" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  