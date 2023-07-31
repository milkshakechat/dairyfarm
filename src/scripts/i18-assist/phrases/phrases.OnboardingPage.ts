
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
  { key: "_txt_welcomeTo_203", text: "Welcome to" },
{ key: "_txt_funGroupchatsForOnlineDating_819", text: "Fun groupchats for online dating." },
{ key: "_txt_RefundProtectionFromBadDates_4f3", text: "100% refund protection from bad dates." },
{ key: "_txt_continue_ca3", text: "Continue" },
{ key: "_txt_careForSomeoneReal_e27", text: "Care for someone real" },
{ key: "_txt_noAiGirlfriendsOnlineDatesWithRealPeopleSharingTheirEverydayLives_5c8", text: "No Ai girlfriends. Online dates with REAL people sharing their everyday lives." },
{ key: "_txt_iAmA_e4e", text: "I am a..." },
{ key: "_txt_man_775", text: "Man" },
{ key: "_txt_woman_54a", text: "Woman" },
{ key: "_txt_other_2fd", text: "Other" },
{ key: "_txt_interestedIn_378", text: "Interested in..." },
{ key: "_txt_women_615", text: "Women" },
{ key: "_txt_men_7b7", text: "Men" },
{ key: "_txt_continue_b9e", text: "Continue" },
{ key: "_txt_join_b83", text: "Join" },
{ key: "_txt_completeYourSignupWithPhone_c65", text: "Complete your signup with phone" },
{ key: "_txt_bringYourMatches_4d8", text: "Bring Your Matches" },
{ key: "_txt_milkshakePrivacyOnlyShowsYourBestSidesClaimYourHiddenUsernameToGetStarted_f34", text: "Milkshake privacy only shows your best sides. Claim your hidden username to get started." },
{ key: "_txt_loading_822", text: "Loading" },
{ key: "_txt_claimUsername_9f0", text: "Claim Username" },
{ key: "_txt_checkSmsCodeSentTo_a63", text: "Check SMS Code sent to" },
{ key: "_txt_code_a1e", text: "Code" },
{ key: "_txt_phone_424", text: "Phone" },
{ key: "_txt_verify_91d", text: "VERIFY" },
{ key: "_txt_reset_9ac", text: "reset" },
{ key: "_txt_signupPhone_ab1", text: "SIGNUP PHONE" },
{ key: "_txt_existingUser_742", text: "Existing User" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  