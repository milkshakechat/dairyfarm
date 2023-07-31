export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "OnboardingPage";
const phrases: PhraseSet[] = [
  { key: "____", text: "Welcome to" },
  { key: "____", text: "Fun groupchats for online dating." },
  { key: "____", text: "100% refund protection from bad dates." },
  { key: "____", text: "Continue" },
  { key: "____", text: "Care for someone real" },
  {
    key: "____",
    text: "No Ai girlfriends. Online dates with REAL people sharing their everyday lives.",
  },
  { key: "____", text: "I am a..." },
  { key: "____", text: "Man" },
  { key: "____", text: "Woman" },
  { key: "____", text: "Other" },
  { key: "____", text: "Interested in..." },
  { key: "____", text: "Women" },
  { key: "____", text: "Men" },
  { key: "____", text: "Continue" },
  { key: "____", text: "Join" },
  { key: "____", text: "Complete your signup with phone" },
  { key: "____", text: "Bring Your Matches" },
  {
    key: "____",
    text: "Milkshake privacy only shows your best sides. Claim your hidden username to get started.",
  },
  { key: "____", text: "Loading" },
  { key: "____", text: "Claim Username" },
  { key: "____", text: "Check SMS Code sent to" },
  { key: "____", text: "Code" },
  { key: "____", text: "Phone" },
  { key: "____", text: "VERIFY" },
  { key: "____", text: "reset" },
  { key: "____", text: "SIGNUP PHONE" },
  { key: "____", text: "Existing User" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
