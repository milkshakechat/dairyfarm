
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "TimelineGallery";
  const phrases: PhraseSet[] = [
  { key: "_txt_removePin_28d", text: "Remove Pin" },
{ key: "_txt_pinStory_898", text: "Pin Story" },
{ key: "_txt_hideStory_f94", text: "Hide Story" },
{ key: "_txt_showStory_fbd", text: "Show Story" },
{ key: "_txt_hideHidden_1ee", text: "Hide Hidden" },
{ key: "_txt_showHidden_7ee", text: "Show Hidden" },
{ key: "_txt_postYourFirstStory_5aa", text: "Post Your First Story" },
{ key: "_txt_upload_48f", text: "Upload" },
{ key: "_txt_nothingToSeeYet_5c1", text: "Nothing to see yet" },
{ key: "_txt_addFriend_666", text: "Add Friend" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  