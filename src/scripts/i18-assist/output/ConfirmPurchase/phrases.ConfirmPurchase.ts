
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "ConfirmPurchase";
  const phrases: PhraseSet[] = [
  { key: "_txt_oneTimePurchase_244", text: "One Time Purchase" },
{ key: "_txt_dailySubscription_d63", text: "Daily Subscription" },
{ key: "_txt_monthlySubscription_790", text: "Monthly Subscription" },
{ key: "_txt_weeklySubscription_36b", text: "Weekly Subscription" },
{ key: "_txt_failedToPurchaseWish_914", text: "Failed to purchase wish" },
{ key: "_txt_confirmPurchase_5bb", text: "Confirm Purchase?" },
{ key: "_txt_DaysProtection_729", text: "90 Days Protection" },
{ key: "_txt_cancel_d09", text: "Cancel" },
{ key: "_txt_offerACustomAmount_106", text: "Offer a custom amount" },
{ key: "_txt_save_ea1", text: "Save" },
{ key: "_txt_buyWishFrom_6b8", text: "Buy Wish from " },
{ key: "_txt_suggest_21a", text: "Suggest" },
{ key: "_txt_note_745", text: "Note" },
{ key: "_txt_oneTime_c5b", text: "One Time" },
{ key: "_txt_daily_5b0", text: "Daily" },
{ key: "_txt_weekly_88d", text: "Weekly" },
{ key: "_txt_monthly_34c", text: "Monthly" },
{ key: "_txt_frequency_d08", text: "Frequency" },
{ key: "_txt_addANoteToYourPurchase_c31", text: "Add a note to your purchase" },
{ key: "_txt_areYouSureYouWantToBuyFrom_83f", text: "Are you sure you want to buy from " },
{ key: "_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_d6c", text: "Milkshake protects you while online dating with 100% refunds within 90 days." },
{ key: "_txt_accountBalance_fd3", text: "Account Balance" },
{ key: "_txt_DaysProtection_fdf", text: "90 Days Protection" },
{ key: "_txt_youWillGetAnExclusiveStickerFrom_af4", text: "You will get an exclusive sticker from " },
{ key: "_txt_confirmPurchase_2ab", text: "CONFIRM PURCHASE" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  