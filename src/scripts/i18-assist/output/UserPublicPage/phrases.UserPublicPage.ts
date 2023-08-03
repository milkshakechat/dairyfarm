
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "UserPublicPage";
  const phrases: PhraseSet[] = [
  { key: "_txt_hiddenProfile_f7d", text: "Hidden Profile" },
{ key: "_txt_privateProfile_f4a", text: "Private Profile" },
{ key: "_txt_publicProfile_f6c", text: "Public Profile" },
{ key: "_txt_message_b57", text: "Message" },
{ key: "_txt_createAccount_9ef", text: "Create Account" },
{ key: "_txt_noUserFound_b9f", text: "No User Found" },
{ key: "_txt_joinTheParty_2e8", text: "Join the Party" },
{ key: "_txt_join_4ba", text: "JOIN" },
{ key: "_txt_login_e06", text: "LOGIN" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  