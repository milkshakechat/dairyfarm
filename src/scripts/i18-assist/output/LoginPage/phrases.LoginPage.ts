
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "LoginPage";
  const phrases: PhraseSet[] = [
  { key: "_txt_email_d63", text: "Email" },
{ key: "_txt_password_274", text: "Password" },
{ key: "_txt_login_752", text: "LOGIN" },
{ key: "_txt_phoneLogin_5c6", text: "Phone Login" },
{ key: "_txt_checkSmsCodeSentTo_eef", text: "Check SMS Code sent to" },
{ key: "_txt_code_8cd", text: "Code" },
{ key: "_txt_phone_7ce", text: "Phone" },
{ key: "_txt_verify_e74", text: "VERIFY" },
{ key: "_txt_reset_486", text: "reset" },
{ key: "_txt_loginPhone_5bd", text: "LOGIN PHONE" },
{ key: "_txt_newUser_b69", text: "New User" },
{ key: "_txt_emailLogin_d6f", text: "Email Login" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  