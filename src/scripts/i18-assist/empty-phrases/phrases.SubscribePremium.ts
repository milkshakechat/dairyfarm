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
  { key: "____", text: "Upgrade to Premium" },
  { key: "____", text: "Unlimited Chat & Video" },
  { key: "____", text: "Premium Sticker Packs" },
  { key: "____", text: "90 Days Refund Protection" },
  { key: "____", text: "SUBSCRIBE" },
  { key: "____", text: "No thanks" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
