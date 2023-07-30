import { PhraseSet, TranslatePageProps } from "@/services/i18-assist";

const componentName = "ProfileSettingsPage";
const phrases: PhraseSet[] = [
  { key: "title", text: "Settings" },
  { key: "languageLabel", text: "Language" },
  { key: "themeLabel", text: "Theme" },
  { key: "privacyLabel", text: "Privacy" },
  { key: "logout", text: "Log Out" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
