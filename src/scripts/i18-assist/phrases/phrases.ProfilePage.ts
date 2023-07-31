
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "ProfilePage";
  const phrases: PhraseSet[] = [
  { key: "_txt_timeline_1aa", text: "Timeline" },
{ key: "_txt_wishlist_6e5", text: "Wishlist" },
{ key: "_txt_upgradeToPremiumForVipBenefits_956", text: "Upgrade to Premium for VIP benefits" },
{ key: "_txt_view_e40", text: "View" },
{ key: "_txt_addMeOnMilkshakeclub_892", text: "Add me on Milkshake.Club" },
{ key: "_txt_copiedProfileLink_4d9", text: "Copied profile link!" },
{ key: "_txt_copy_aa7", text: "Copy" },
{ key: "_txt_close_196", text: "Close" },
{ key: "_txt_hiddenProfilesCantBeFoundByUsername_f0a", text: "Hidden profiles can't be found by username" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  