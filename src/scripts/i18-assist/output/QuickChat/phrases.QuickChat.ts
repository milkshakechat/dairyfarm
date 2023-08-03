
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "QuickChat";
  const phrases: PhraseSet[] = [
  { key: "_txt_viewChat_ea6", text: "View Chat" },
{ key: "_txt_youDoNotHaveEnoughCookiesInYourWallet_f12", text: "You do not have enough cookies in your wallet." },
{ key: "_txt_clickHereToBuyCookies_421", text: "Click here to buy cookies." },
{ key: "_txt_sendAMessage_a6a", text: "Send a message" },
{ key: "_txt_DaysProtection_d23", text: "90 Days Protection" },
{ key: "_txt_cancel_4aa", text: "Cancel" },
{ key: "_txt_sendAMessage_dcd", text: "Send a message" },
{ key: "_txt_typeAMessage_ca4", text: "Type a message..." },
{ key: "_txt_giftACustomAmount_ff3", text: "Gift a custom amount" },
{ key: "_txt_save_727", text: "Save" },
{ key: "_txt_giveHerACookie_9cc", text: "Give her a cookie?" },
{ key: "_txt_suggest_bde", text: "Suggest" },
{ key: "_txt_balance_f75", text: "Balance" },
{ key: "_txt_areYouSureYouWantToGift_617", text: "Are you sure you want to gift " },
{ key: "_txt_CookiesTo_3ee", text: " cookies to " },
{ key: "_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_612", text: "Milkshake protects you while online dating with 100% refunds within 90 days." },
{ key: "_txt_sendMessage_7ff", text: "SEND MESSAGE" },
{ key: "_txt_cancel_12a", text: "Cancel" },
{ key: "_txt_noProtection", text: "No Protection" },
{ key: "_txt_permanetNotRecc", text: "Permanent transfer are NOT recommended. You will not have refund protection." },
{ key: "_txt_lbelPermant", text: "Permanent" },
{ key: "_txt_areYourSurePerm", text: "Are you sure you want to permanently transfer " },
{ key: "_txt_cannotRefundPerm", text: "You will not be able to refund this transfer." },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  