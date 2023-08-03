
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "AppLayout";
  const phrases: PhraseSet[] = [
  { key: "_txt_dating_5ad", text: "Dating" },
{ key: "_txt_wallet_20a", text: "Wallet" },
{ key: "_txt_logOut_745", text: "Log Out" },
{ key: "_txt_confirmLogout_31a", text: "Confirm Logout" },
{ key: "_txt_areYouSureYouWantToLogOut_bcc", text: "Are you sure you want to log out?" },
{ key: "_txt_messages_sidebar", text: "Chats" },
{ key: "_txt_notifications_sidebar", text: "Notifications" },
{ key: "_txt_account_sidebar", text: "Account" },
{ key: "_txt_profile_sidebar", text: "Profile" },
{ key: "_txt_contacts_sidebar", text: "Contacts" },
{ key: "_txt_wishlists_sidebar", text: "Wishlists" },
{ key: "_txt_settings_sidebar", text: "Settings" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  