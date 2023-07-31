
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "TopUpWallet";
  const phrases: PhraseSet[] = [
  { key: "_txt_oneTimePurchase_e6e", text: "One Time Purchase" },
{ key: "_txt_dailySubscription_1de", text: "Daily Subscription" },
{ key: "_txt_monthlySubscription_7bf", text: "Monthly Subscription" },
{ key: "_txt_weeklySubscription_b10", text: "Weekly Subscription" },
{ key: "_txt_failedToPurchaseWish_b3c", text: "Failed to purchase wish" },
{ key: "_txt_topUpWallet_45c", text: "Top Up Wallet" },
{ key: "_txt_cancel_2fc", text: "Cancel" },
{ key: "_txt_enterACustomAmount_6e8", text: "Enter a custom amount" },
{ key: "_txt_save_b7d", text: "Save" },
{ key: "_txt_addCookiesToWallet_f1c", text: "Add cookies to wallet" },
{ key: "_txt_suggest_3a7", text: "Suggest" },
{ key: "_txt_areYouSureYouWantToBuy_35a", text: "Are you sure you want to buy " },
{ key: "_txt_CookiesToAddToYourWalletMilkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_e83", text: " cookies to add to your wallet? Milkshake protects you while online dating with 100% refunds within 90 days." },
{ key: "_txt_accountBalance_287", text: "Account Balance" },
{ key: "_txt_confirmPurchase_e9c", text: "CONFIRM PURCHASE" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  