
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "MobileScreen";
  const phrases: PhraseSet[] = [
  { key: "_txt_dating_ce0", text: "Dating" },
{ key: "_txt_menu_30d", text: "Menu" },
{ key: "_txt_wishlist_acb", text: "Wishlist" },
{ key: "_txt_wallet_c9c", text: "Wallet" },
{ key: "_txt_refresh_5ce", text: "Refresh" },
{ key: "_txt_confirmLogout_36e", text: "Confirm Logout" },
{ key: "_txt_areYouSureYouWantToLogOut_bb5", text: "Are you sure you want to log out?" },
{ key: "_txt_yes_be5", text: "Yes" },
{ key: "_txt_no_1e1", text: "No" },
{ key: "_txt_logOut_6dc", text: "Log Out" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  