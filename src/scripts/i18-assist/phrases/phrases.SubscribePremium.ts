
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "SubscribePremium";
  const phrases: PhraseSet[] = [
  { key: "_txt_upgradeToPremium_d10", text: "Upgrade to Premium" },
{ key: "_txt_unlimitedChatVideo_cde", text: "Unlimited Chat & Video" },
{ key: "_txt_premiumStickerPacks_847", text: "Premium Sticker Packs" },
{ key: "_txt_DaysRefundProtection_404", text: "90 Days Refund Protection" },
{ key: "_txt_subscribe_bf7", text: "SUBSCRIBE" },
{ key: "_txt_noThanks_620", text: "No thanks" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  